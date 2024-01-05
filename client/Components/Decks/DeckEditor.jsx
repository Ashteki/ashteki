import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';
import { connect } from 'react-redux';
import { Form, Col, Row } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import TextArea from '../Form/TextArea.jsx';
import * as actions from '../../redux/actions';

class InnerDeckEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardList: '',
            diceList: '',
            notes: '',
            deck: this.copyDeck(props.deck),
            numberToAdd: 1,
            validation: {
                deckname: '',
                cardToAdd: ''
            }
        };
    }

    handleCancelClick() {
        this.props.navigate('/decks');

        return;
    }

    componentDidMount() {
        let cardList = '';
        if (this.props.deck && (this.props.deck.cards || this.props.deck.conjurations)) {
            this.pbid =
                this.props.deck.phoenixborn.length > 0 ? this.props.deck.phoenixborn[0].id : '';

            _.each(this.props.deck.cards, (card) => {
                cardList += this.getCardListEntry(card.count, card.card, card.ff);
            });

            // _.each(this.props.deck.conjurations, (card) => {
            //     cardList += this.getCardListEntry(card.count, card.card);
            // });

            this.setState({ cardList: cardList });
        }

        let diceList = '';
        if (this.props.deck && this.props.deck.dicepool) {
            _.each(this.props.deck.dicepool, (diceCount) => {
                diceList += this.getDiceListEntry(diceCount);
            });

            this.setState({ diceList: diceList });
        }
    }

    // XXX One could argue this is a bit hacky, because we're updating the innards of the deck object, react doesn't update components that use it unless we change the reference itself
    copyDeck(deck) {
        if (!deck) {
            return {
                name: 'New Deck',
                phoenixborn: []
            };
        }

        return {
            _id: deck._id,
            name: deck.name,
            phoenixborn: deck.phoenixborn,
            cards: deck.cards,
            conjurations: deck.conjurations,
            status: deck.status,
            notes: deck.notes,
            dicepool: deck.dicepool
        };
    }

    onChange(field, event) {
        let deck = this.copyDeck(this.state.deck);

        deck[field] = event.target.value;

        this.setState({ deck: deck });
        this.props.updateDeck(deck);
    }

    onPbChange(event) {
        let deck = this.copyDeck(this.state.deck);
        let pb = this.props.cards[event.target.value];

        if (deck.phoenixborn.length == 0) {
            deck.phoenixborn.push(pb);
        } else deck.phoenixborn[0] = pb;
        this.pbid = pb.id;

        this.rebuildConjurations(deck);
        this.setState({ deck: deck });
        this.props.updateDeck(deck);
    }

    onNumberToAddChange(event) {
        this.setState({ numberToAdd: event.target.value });
    }

    addCardChange(selectedCards) {
        this.setState({ cardToAdd: selectedCards[0] });
    }

    onAddCard(event) {
        event.preventDefault();

        if (
            !this.state.cardToAdd ||
            !this.state.cardToAdd.name ||
            this.state.cardToAdd.type == 'Phoenixborn'
        ) {
            return;
        }

        let deck = this.state.deck;
        this.addCard(this.state.cardToAdd, parseInt(this.state.numberToAdd), deck);

        let cardList = this.state.cardList;
        cardList += this.getCardListEntry(this.state.numberToAdd, this.state.cardToAdd);
        this.setState({ cardList: cardList });

        deck = this.copyDeck(deck);

        this.props.updateDeck(deck);
    }

    onCardListChange(event) {
        event.preventDefault();

        let deck = this.state.deck;
        let split = event.target.value.split('\n');

        deck.cards = [];
        deck.conjurations = [];

        _.each(split, (line) => {
            line = line.trim();

            if (!$.isNumeric(line[0])) {
                return;
            }

            let index = 0;
            while (!isNaN(line[index]) || line[index] === 'x') {
                index++;
            }
            let num = parseInt(line.substr(0, index));
            let cardName = line.substr(index, line.length).trim();
            let isFirstFive = false;
            if (cardName.endsWith(' ff')) {
                isFirstFive = true;
                cardName = cardName.substr(0, cardName.length - 3);
            }

            let card = this.getCard(cardName);

            if (card) {
                const isConjuration = card.type === 'Conjuration' || card.type === 'Conjured Alteration Spell';
                if (!isConjuration) {
                    this.addCard(card, num, deck, isFirstFive);
                }
            }
        });

        this.addConjurations(deck.phoenixborn[0].card, deck);
        deck = this.copyDeck(deck);

        this.setState({ cardList: event.target.value, deck: deck });
        this.props.updateDeck(deck);
    }

    getCard(cardName) {
        return this.getAllCards().find(
            (card) => card.name.toLowerCase() === cardName.toLowerCase()
        );
    }

    getAllCards() {
        return _.toArray(this.props.cards).filter((card) => card.deckType !== 'chimera');
    }

    onDiceListChange(event) {
        event.preventDefault();

        let deck = this.state.deck;
        let split = event.target.value.split('\n');

        deck.dicepool = [];

        _.each(split, (line) => {
            line = line.trim();

            if (!$.isNumeric(line[0])) {
                return;
            }

            let index = 0;
            while (!isNaN(line[index]) || line[index] === 'x') {
                index++;
            }
            let num = parseInt(line.substr(0, index));
            let magic = this.parseMagic(line.substr(index, line.length).toLowerCase());
            if (magic == '') return;
            deck.dicepool.push({ magic: magic.toLowerCase(), count: num });
        });

        deck = this.copyDeck(deck);

        this.setState({ diceList: event.target.value, deck: deck });
        this.props.updateDeck(deck);
    }

    parseMagic(input) {
        let mgc = '';
        // do translations / synonyms
        switch (input) {
            case 'nature':
            case 'nat':
            case 'natural':
                mgc = 'natural';
                break;
            case 'cha':
            case 'charm':
                mgc = 'charm';
                break;
            case 'ill':
            case 'illusion':
                mgc = 'illusion';
                break;
            case 'cer':
            case 'ceremonial':
                mgc = 'ceremonial';
                break;
            case 'div':
            case 'divine':
                mgc = 'divine';
                break;
            case 'sym':
            case 'sympathy':
                mgc = 'sympathy';
                break;
            case 'tim':
            case 'time':
                mgc = 'time';
                break;
        }
        let validMagics = [
            'charm',
            'ceremonial',
            'illusion',
            'natural',
            'divine',
            'sympathy',
            'time'
        ];
        let isValid = validMagics.includes(mgc);
        return isValid ? mgc : '';
    }

    addCard(card, number, deck, isFirstFive) {
        let phoenixborn = deck.phoenixborn;
        let conjurations = deck.conjurations;
        let cards = deck.cards;

        let list;

        if (card.type === 'Conjuration' || card.type === 'Conjured Alteration Spell') {
            list = conjurations;
        } else if (card.type === 'Phoenixborn') {
            list = phoenixborn;
        } else {
            list = cards;
        }

        const entry = list.find(c => c.id === card.stub);
        if (entry) {
            entry.count += number;
        } else {
            list.push({
                count: number,
                card: card,
                id: card.stub,
                conjurations: card.conjurations,
                ff: isFirstFive
            });
        }
        this.addConjurations(card, deck);
    }

    addConjurations(card, deck) {
        if (card.conjurations) {
            card.conjurations.forEach((conj) => {
                if (!deck.conjurations.some((c) => c.id === conj.stub)) {
                    var c = this.getCard(conj.name);
                    if (c) {
                        this.addCard(c, c.copies, deck);
                    }
                }
            });
        }
    }

    rebuildConjurations(deck) {
        deck.conjurations = [];

        this.addConjurations(deck.phoenixborn[0], deck);
        deck.cards.forEach((c) => this.addConjurations(c, deck));
    }

    onSaveClick(event) {
        event.preventDefault();

        if (this.props.onDeckSave) {
            this.props.onDeckSave(this.props.deck);
        }
    }

    getCardListEntry(count, card, ff) {
        const fFive = ff ? ' ff' : '';
        return count + ' ' + card.name + fFive + '\n';
    }

    getDiceListEntry(diceCount) {
        return diceCount.count + ' ' + diceCount.magic + '\n';
    }

    render() {
        if (!this.props.deck || this.props.loading) {
            return <div>Waiting for deck...</div>;
        }

        let phoenixbornCards = this.getAllCards().filter((c) => c.type == 'Phoenixborn');
        phoenixbornCards.sort((a, b) => (a.name < b.name ? -1 : 1));

        const lookupCards = this.getAllCards().filter((c) => c.deckType !== 'chimera');

        return (
            <div>
                <Form>
                    <Form.Group as={Row} controlId='deckName'>
                        <Form.Label column sm='3'>
                            Deck Name
                        </Form.Label>
                        <Col>
                            <Form.Control
                                as='input'
                                defaultValue={this.state.deck.name}
                                onChange={this.onChange.bind(this, 'name')}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId='phoenixborn'>
                        <Form.Label column sm='3'>
                            Phoenixborn
                        </Form.Label>
                        <Col>
                            <Form.Control
                                as='select'
                                onChange={this.onPbChange.bind(this)}
                                value={this.pbid}
                            >
                                {phoenixbornCards.map((c, index) => {
                                    return (
                                        <option key={index} value={c.stub}>
                                            {c.name}
                                        </option>
                                    );
                                })}
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <h4>
                        You can type card names and quantities into the box below, or add them using
                        this lookup box.
                    </h4>

                    <Form.Group as={Row} controlId='cardLookup'>
                        <Form.Label column sm='3'>
                            Card
                        </Form.Label>
                        <Col sm='4'>
                            <Typeahead
                                options={lookupCards}
                                onChange={this.addCardChange.bind(this)}
                                labelKey={'name'}
                            />
                        </Col>
                        <Form.Label column sm='2'>
                            Count
                        </Form.Label>
                        <Col sm='2'>
                            <Form.Control
                                as='input'
                                onChange={this.onNumberToAddChange.bind(this)}
                                defaultValue={this.state.numberToAdd.toString()}
                            />
                        </Col>
                    </Form.Group>
                    <Row>
                        <Col sm='3'></Col>
                        <Col>
                            <button className='btn btn-primary def' onClick={this.onAddCard.bind(this)}>
                                Add
                            </button>
                        </Col>
                    </Row>
                    <TextArea
                        label='Cards'
                        rows='4'
                        value={this.state.cardList}
                        onChange={this.onCardListChange.bind(this)}
                    />
                    <h4>Enter dice quantities into the box below, one per line e.g. 3 Charm</h4>
                    <TextArea
                        label='Dice'
                        rows='4'
                        value={this.state.diceList}
                        onChange={this.onDiceListChange.bind(this)}
                    />
                    <TextArea
                        label='Notes'
                        rows='4'
                        value={this.state.deck.notes}
                        onChange={this.onChange.bind(this, 'notes')}
                    />

                    <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                            <button
                                // eslint-disable-next-line react/no-string-refs
                                ref='submit'
                                type='submit'
                                className='btn btn-success def'
                                onClick={this.onSaveClick.bind(this)}
                            >
                                Save Deck
                            </button>
                            <button className='btn btn-primary def' onClick={this.handleCancelClick.bind(this)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}

InnerDeckEditor.displayName = 'DeckEditor';
InnerDeckEditor.propTypes = {
    cards: PropTypes.object,
    deck: PropTypes.object,
    loading: PropTypes.bool,
    mode: PropTypes.string,
    navigate: PropTypes.func,
    onDeckSave: PropTypes.func,
    updateDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        cards: state.cards.cards,
        deck: state.cards.selectedDeck,
        decks: state.cards.decks,
        loading: state.api.loading
    };
}

const DeckEditor = connect(mapStateToProps, actions)(InnerDeckEditor);

export default DeckEditor;
