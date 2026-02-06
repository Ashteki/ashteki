import React, { useState, useEffect } from 'react';
import _ from 'underscore';
import $ from 'jquery';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Col, Row } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import TextArea from '../Form/TextArea.jsx';
import * as actions from '../../redux/actions';
import { useNavigate } from 'react-router-dom';

function copyDeck(deck) {
    if (!deck) {
        return {
            name: 'New Deck',
            phoenixborn: []
        };
    }

    return {
        _id: deck._id,
        name: deck.name,
        phoenixborn: deck.phoenixborn || [],
        cards: deck.cards || [],
        conjurations: deck.conjurations || [],
        status: deck.status,
        notes: deck.notes,
        dicepool: deck.dicepool || []
    };
}

function InnerDeckEditor({ onDeckSave }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cards = useSelector((state) => state.cards.cards);
    const selectedDeck = useSelector((state) => state.cards.selectedDeck);
    const loading = useSelector((state) => state.api.loading);
    const [cardList, setCardList] = useState('');
    const [diceList, setDiceList] = useState('');
    const [deck, setDeck] = useState(copyDeck(selectedDeck));
    const [numberToAdd, setNumberToAdd] = useState(1);
    const [cardToAdd, setCardToAdd] = useState(null);
    const [validation] = useState({ deckname: '', cardToAdd: '' });
    const [pbid, setPbid] = useState('');

    useEffect(() => {
        let cardListLocal = '';
        if (selectedDeck && (selectedDeck.cards || selectedDeck.conjurations)) {
            setPbid(selectedDeck.phoenixborn && selectedDeck.phoenixborn.length > 0 ? selectedDeck.phoenixborn[0].id : '');

            _.each(selectedDeck.cards || [], (card) => {
                cardListLocal += getCardListEntry(card.count, card.card, card.ff);
            });

            setCardList(cardListLocal);
        }

        let diceListLocal = '';
        if (selectedDeck && selectedDeck.dicepool) {
            _.each(selectedDeck.dicepool, (diceCount) => {
                diceListLocal += getDiceListEntry(diceCount);
            });

            setDiceList(diceListLocal);
        }

        setDeck(copyDeck(selectedDeck));
    }, [selectedDeck]);

    function handleCancelClick() {
        navigate('/decks');
        return;
    }

    // copyDeck moved out as a helper below
    function onChange(field, event) {
        let newDeck = copyDeck(deck);

        newDeck[field] = event.target.value;

        setDeck(newDeck);
        dispatch(actions.updateDeck(newDeck));
    }

    function onPbChange(event) {
        let newDeck = copyDeck(deck);
        let pb = cards[event.target.value];

        if (!newDeck.phoenixborn || newDeck.phoenixborn.length === 0) {
            newDeck.phoenixborn = [pb];
        } else newDeck.phoenixborn[0] = pb;
        setPbid(pb.id);

        rebuildConjurations(newDeck);
        setDeck(newDeck);
        dispatch(actions.updateDeck(newDeck));
    }

    function onNumberToAddChange(event) {
        setNumberToAdd(event.target.value);
    }

    function addCardChange(selectedCards) {
        setCardToAdd(selectedCards[0]);
    }

    function onAddCard(event) {
        event.preventDefault();

        if (!cardToAdd || !cardToAdd.name || cardToAdd.type == 'Phoenixborn') {
            return;
        }

        let newDeck = deck;
        addCard(cardToAdd, parseInt(numberToAdd), newDeck);

        let cardListLocal = cardList;
        cardListLocal += getCardListEntry(numberToAdd, cardToAdd);
        setCardList(cardListLocal);

        newDeck = copyDeck(newDeck);

        dispatch(actions.updateDeck(newDeck));
    }

    function onCardListChange(event) {
        event.preventDefault();

        let newDeck = deck;
        let split = event.target.value.split('\n');

        newDeck.cards = [];
        newDeck.conjurations = [];

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

            let card = getCard(cardName);

            if (card) {
                const isConjuration = card.type === 'Conjuration' || card.type === 'Conjured Alteration Spell';
                if (!isConjuration) {
                    addCard(card, num, newDeck, isFirstFive);
                }
            }
        });

        if (newDeck.phoenixborn && newDeck.phoenixborn[0]) {
            addConjurations(newDeck.phoenixborn[0].card, newDeck);
        }
        newDeck = copyDeck(newDeck);

        setCardList(event.target.value);
        setDeck(newDeck);
        dispatch(actions.updateDeck(newDeck));
    }

    function getCard(cardName) {
        return getAllCards().find((card) => card.name.toLowerCase() === cardName.toLowerCase());
    }

    function getAllCards() {
        return _.toArray(cards).filter((card) => card.deckType !== 'chimera');
    }

    function onDiceListChange(event) {
        event.preventDefault();

        let newDeck = deck;
        let split = event.target.value.split('\n');

        newDeck.dicepool = [];

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
            let magic = parseMagic(line.substr(index, line.length).toLowerCase());
            if (magic == '') return;
            newDeck.dicepool.push({ magic: magic.toLowerCase(), count: num });
        });

        newDeck = copyDeck(newDeck);

        setDiceList(event.target.value);
        setDeck(newDeck);
        dispatch(actions.updateDeck(newDeck));
    }

    function parseMagic(input) {
        let mgc = '';
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
            case 'art':
            case 'artifice':
                mgc = 'artifice';
                break;
            case 'ast':
            case 'astral':
                mgc = 'astral';
        }
        let validMagics = [
            'charm',
            'ceremonial',
            'illusion',
            'natural',
            'divine',
            'sympathy',
            'time',
            'artifice',
            'astral'
        ];
        let isValid = validMagics.includes(mgc);
        return isValid ? mgc : '';
    }

    function addCard(card, number, newDeck, isFirstFive) {
        let phoenixborn = newDeck.phoenixborn || [];
        let conjurations = newDeck.conjurations || [];
        let cards = newDeck.cards || [];

        let list;

        if (card.type === 'Conjuration' || card.type === 'Conjured Alteration Spell') {
            list = conjurations;
        } else if (card.type === 'Phoenixborn') {
            list = phoenixborn;
        } else {
            list = cards;
        }

        const entry = list.find((c) => c.id === card.stub);
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
        addConjurations(card, newDeck);
    }

    function addConjurations(card, newDeck) {
        if (card && card.conjurations) {
            card.conjurations.forEach((conj) => {
                if (!newDeck.conjurations.some((c) => c.id === conj.stub)) {
                    var c = getCard(conj.name);
                    if (c) {
                        addCard(c, c.copies, newDeck);
                    }
                }
            });
        }
    }

    function rebuildConjurations(newDeck) {
        newDeck.conjurations = [];

        if (newDeck.phoenixborn && newDeck.phoenixborn[0]) {
            addConjurations(newDeck.phoenixborn[0], newDeck);
        }
        (newDeck.cards || []).forEach((c) => addConjurations(c, newDeck));
    }

    function onSaveClick(event) {
        event.preventDefault();

        if (onDeckSave) {
            onDeckSave(selectedDeck);
        }
    }

    function getCardListEntry(count, card, ff) {
        const fFive = ff ? ' ff' : '';
        return count + ' ' + card.name + fFive + '\n';
    }

    function getDiceListEntry(diceCount) {
        return diceCount.count + ' ' + diceCount.magic + '\n';
    }

    if (!selectedDeck || loading) {
        return <div>Waiting for deck...</div>;
    }

    let phoenixbornCards = getAllCards().filter((c) => c.type == 'Phoenixborn');
    phoenixbornCards.sort((a, b) => (a.name < b.name ? -1 : 1));

    const lookupCards = getAllCards().filter((c) => c.deckType !== 'chimera');

    return (
        <div>
            <Form>
                <Form.Group as={Row} controlId='deckName'>
                    <Form.Label column sm='3'>
                        Deck Name
                    </Form.Label>
                    <Col>
                        <Form.Control as='input' value={deck.name} onChange={(e) => onChange('name', e)} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId='phoenixborn'>
                    <Form.Label column sm='3'>
                        Phoenixborn
                    </Form.Label>
                    <Col>
                        <Form.Control as='select' onChange={onPbChange} value={pbid}>
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
                        <Typeahead options={lookupCards} onChange={addCardChange} labelKey={'name'} />
                    </Col>
                    <Form.Label column sm='2'>
                        Count
                    </Form.Label>
                    <Col sm='2'>
                        <Form.Control as='input' onChange={onNumberToAddChange} value={numberToAdd.toString()} />
                    </Col>
                </Form.Group>
                <Row>
                    <Col sm='3'></Col>
                    <Col>
                        <button className='btn btn-primary def' onClick={onAddCard}>
                            Add
                        </button>
                    </Col>
                </Row>
                <TextArea label='Cards' rows='4' value={cardList} onChange={onCardListChange} />
                <h4>Enter dice quantities into the box below, one per line e.g. 3 Charm</h4>
                <TextArea label='Dice' rows='4' value={diceList} onChange={onDiceListChange} />
                <TextArea label='Notes' rows='4' value={deck.notes} onChange={(e) => onChange('notes', e)} />

                <div className='form-group'>
                    <div className='col-sm-offset-3 col-sm-8'>
                        <button type='submit' className='btn btn-success def' onClick={onSaveClick}>
                            Save Deck
                        </button>
                        <button className='btn btn-primary def' onClick={handleCancelClick}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    );
}

InnerDeckEditor.displayName = 'DeckEditor';

export default InnerDeckEditor;
