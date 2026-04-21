import React, { useState, useEffect, useRef } from 'react';
import _ from 'underscore';
import $ from 'jquery';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Col, Row } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import TextArea from '../Form/TextArea.jsx';
import { updateDeck } from '../../redux/actions';
import { useNavigate } from 'react-router-dom';
import './DeckEditor.scss';

function DeckEditor({ deck, onDeckSave, isChimera }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const typeaheadRef = useRef(null);

    const cards = useSelector((state) => state.cards.cards);
    // const deck = useSelector((state) => state.cards.selectedDeck);
    const loading = useSelector((state) => state.api.loading);

    const [cardList, setCardList] = useState('');
    const [diceList, setDiceList] = useState('');
    const [deckState, setDeckState] = useState(copyDeck(deck));
    const [numberToAdd, setNumberToAdd] = useState(1);
    const [cardToAdd, setCardToAdd] = useState(null);
    const [pbid, setPbid] = useState('');

    function copyDeck(deckToCopy) {
        if (!deckToCopy) {
            return {
                name: 'New Deck',
                phoenixborn: [],
                cards: [],
                conjurations: [],
                notes: '',
                dicepool: []
            };
        }

        return {
            _id: deckToCopy._id,
            name: deckToCopy.name,
            phoenixborn: deckToCopy.phoenixborn,
            ultimate: deckToCopy.ultimate,
            behaviour: deckToCopy.behaviour,
            cards: deckToCopy.cards,
            conjurations: deckToCopy.conjurations,
            status: deckToCopy.status,
            notes: deckToCopy.notes,
            dicepool: deckToCopy.dicepool,
            mode: deckToCopy.mode
        };
    }

    function getCardListEntry(count, card, ff) {
        const fFive = ff ? ' ff' : '';
        return count + ' ' + card.name + fFive + '\n';
    }

    function getDiceListEntry(diceCount) {
        return diceCount.count + ' ' + diceCount.magic + '\n';
    }

    function addConjurations(card, deckToUpdate) {
        if (card.conjurations) {
            card.conjurations.forEach((conj) => {
                if (!deckToUpdate.conjurations.some((c) => c.id === conj.stub)) {
                    var c = getCard(conj.name);
                    if (c) {
                        addCard(c, c.copies, deckToUpdate);
                    }
                }
            });
        }
    }

    function rebuildConjurations(deckToUpdate) {
        deckToUpdate.conjurations = [];

        addConjurations(deckToUpdate.phoenixborn[0], deckToUpdate);
        deckToUpdate.cards.forEach((c) => addConjurations(c, deckToUpdate));
    }

    function rebuildBehaviourAndUltimate(deckToUpdate) {
        deckToUpdate.behaviour = [];
        deckToUpdate.ultimate = [];

        addBehaviour(deckToUpdate.phoenixborn[0], deckToUpdate);
        addUltimate(deckToUpdate.phoenixborn[0], deckToUpdate);
    }

    function addBehaviour(card, deckToUpdate) {
        if (card.behaviourCard) {
            var c = getCard(card.behaviourCard);
            if (c) {
                addCard(c, c.copies, deckToUpdate);
            }
        }
    }

    function addUltimate(card, deckToUpdate) {
        if (card.ultimateCard) {
            var c = getCard(card.ultimateCard);
            if (c) {
                addCard(c, c.copies, deckToUpdate);
            }
        }
    }

    function addCard(card, number, deckToUpdate, isFirstFive) {
        let phoenixborn = deckToUpdate.phoenixborn;
        let conjurations = deckToUpdate.conjurations;
        let cardsList = deckToUpdate.cards;
        let behaviours = deckToUpdate.behaviour;
        let ultimates = deckToUpdate.ultimate;

        let list;

        if (['Conjuration', 'Conjured Alteration Spell', 'Conjured Aspect'].includes(card.type)) {
            list = conjurations;
        } else if (['Phoenixborn', 'Chimera'].includes(card.type)) {
            list = phoenixborn;
        } else if (card.type === 'Behaviour') {
            list = behaviours;
        } else if (card.stub.includes('ultimate')) {
            list = ultimates;
        } else {
            list = cardsList;
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
        addConjurations(card, deckToUpdate);
    }

    function parseMagic(input) {
        let mgc = '';
        switch (input) {
            case 'artifice':
            case 'art':
                mgc = 'artifice';
                break;
            case 'astral':
            case 'ast':
                mgc = 'astral';
                break;
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
            case 'rage':
                mgc = 'rage';
                break;
        }
        let validMagics = [
            'artifice',
            'astral',
            'charm',
            'ceremonial',
            'illusion',
            'natural',
            'divine',
            'sympathy',
            'time'
        ];
        if (isChimera) {
            validMagics.push('rage');
        }
        let isValid = validMagics.includes(mgc);
        return isValid ? mgc : '';
    }

    useEffect(() => {
        let newCardList = '';
        if (deck && (deck.cards || deck.conjurations)) {
            const newPbid = deck.phoenixborn.length > 0 ? deck.phoenixborn[0].id : '';
            setPbid(newPbid);

            _.each(deck.cards, (card) => {
                newCardList += getCardListEntry(card.count, card.card, card.ff);
            });

            setCardList(newCardList);
        }

        let newDiceList = '';
        if (deck && deck.dicepool) {
            _.each(deck.dicepool, (diceCount) => {
                newDiceList += getDiceListEntry(diceCount);
            });

            setDiceList(newDiceList);
        }

        setDeckState(copyDeck(deck));
    }, []);

    function handleCancelClick() {
        if (isChimera) {
            navigate('/decks/chimera');
        } else {
            navigate('/decks');
        }
    }

    function onChange(field, event) {
        let newDeck = copyDeck(deckState);
        newDeck[field] = event.target.value;
        setDeckState(newDeck);
        dispatch(updateDeck(newDeck));
    }

    function onPbChange(event) {
        let newDeck = copyDeck(deckState);
        let pb = cards[event.target.value];

        if (newDeck.phoenixborn.length == 0) {
            newDeck.phoenixborn.push(pb);
        } else newDeck.phoenixborn[0] = pb;
        setPbid(pb.id);

        if (pb.type === 'Chimera') {
            rebuildBehaviourAndUltimate(newDeck);
        }
        rebuildConjurations(newDeck);
        setDeckState(newDeck);
        dispatch(updateDeck(newDeck));
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

        let newDeck = deckState;
        addCard(cardToAdd, parseInt(numberToAdd), newDeck);

        let newCardList = cardList;
        newCardList += getCardListEntry(numberToAdd, cardToAdd);
        setCardList(newCardList);

        typeaheadRef.current.clear();

        newDeck = copyDeck(newDeck);
        setDeckState(newDeck);
        dispatch(updateDeck(newDeck));
    }

    function onCardListChange(event) {
        event.preventDefault();

        let newDeck = deckState;
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

            let cardToAddFromList = getCard(cardName);

            if (cardToAddFromList) {
                const isConjuration =
                    cardToAddFromList.type === 'Conjuration' ||
                    cardToAddFromList.type === 'Conjured Alteration Spell';
                if (!isConjuration) {
                    addCard(cardToAddFromList, num, newDeck, isFirstFive);
                }
            }
        });

        addConjurations(newDeck.phoenixborn[0].card, newDeck);
        newDeck = copyDeck(newDeck);

        setCardList(event.target.value);
        setDeckState(newDeck);
        dispatch(updateDeck(newDeck));
    }

    function getCard(searchText) {
        const exactMatch = getAllCards().find((card) =>
            card.stub === searchText ||
            card.name.toLowerCase() === searchText.toLowerCase()
        );

        if (exactMatch) {
            return exactMatch;
        }
        const matches = getAllCards().filter((card) =>
            card.name.toLowerCase().includes(searchText.toLowerCase())
        );

        if (matches.length === 1) {
            return matches[0];
        }
        return null;
    }

    function getAllCards(includeConjurations = false) {
        return _.toArray(cards).filter(
            (card) =>
                ((isChimera && card.deckType === 'chimera') ||
                    (!isChimera && card.deckType !== 'chimera')) &&
                (includeConjurations || card.type !== 'conjuration')
        );
    }

    function onDiceListChange(event) {
        event.preventDefault();
        if (isChimera) {
            return;
        }
        let newDeck = deckState;
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
        setDeckState(newDeck);
        dispatch(updateDeck(newDeck));
    }

    function onSaveClick(event) {
        event.preventDefault();

        if (onDeckSave) {
            onDeckSave(deck);
        }
    }

    if (!deck || loading) {
        return <div>Waiting for deck...</div>;
    }

    let phoenixbornCards = getAllCards().filter(
        (c) => (isChimera && c.type === 'Chimera') || (!isChimera && c.type == 'Phoenixborn')
    );
    phoenixbornCards.sort((a, b) => (a.name < b.name ? -1 : 1));
    const conjurationTypes = ['Conjuration', 'Conjured Alteration Spell', 'Conjured Aspect'];
    const lookupCards = getAllCards().filter(
        (c) =>
            !conjurationTypes.includes(c.type) &&
            ((isChimera &&
                c.deckType === 'chimera' &&
                !c.name.includes('Ultimate') &&
                !c.name.includes('Behaviour') &&
                c.type !== 'Chimera') ||
                (!isChimera && c.deckType !== 'chimera'))
    );

    return (
        <div className='deck-editor'>
            <Form>
                <Form.Group as={Row} controlId='deckName'>
                    <Form.Label column sm='3'>
                        Deck Name
                    </Form.Label>
                    <Col>
                        <Form.Control
                            as='input'
                            defaultValue={deckState.name}
                            onChange={(e) => onChange('name', e)}
                        />
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
                        <Typeahead
                            options={lookupCards}
                            onChange={addCardChange}
                            labelKey={'name'}
                            ref={typeaheadRef}
                            id='cardtypeahead'
                        />
                    </Col>
                    <Form.Label column sm='1'>
                        Count
                    </Form.Label>
                    <Col sm='2'>
                        <Form.Control
                            as='input'
                            onChange={onNumberToAddChange}
                            defaultValue={numberToAdd.toString()}
                        />
                    </Col>
                    <Col sm='2'>
                        <button className='btn btn-primary def' onClick={onAddCard}>
                            Add
                        </button>
                    </Col>
                </Form.Group>
                <TextArea label='Cards' rows='10' value={cardList} onChange={onCardListChange} />
                <h4>Enter dice quantities into the box below, one per line e.g. 3 Charm</h4>
                <TextArea
                    label='Dice'
                    rows={isChimera ? 2 : 4}
                    value={diceList}
                    onChange={onDiceListChange}
                    disabled={isChimera}
                />
                <TextArea
                    label='Notes'
                    rows='4'
                    value={deckState.notes || ''}
                    onChange={(e) => onChange('notes', e)}
                />

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

DeckEditor.displayName = 'DeckEditor';

export default DeckEditor;
