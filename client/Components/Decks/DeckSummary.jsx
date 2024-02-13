import React, { useState } from 'react';
import { Col, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import './DeckSummary.scss';
import CardListText from './CardListText';
import CardListImg from './CardListImg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faList } from '@fortawesome/free-solid-svg-icons';
import DeckDice from './DeckDice';

const DeckSummary = ({ deck, editMode }) => {

    const [radioValue, setRadioValue] = useState(false);
    const [magicHover, setMagicHover] = useState('');

    if (!deck) return null;

    const onDieClick = (die) => {
        if (editMode) {
            alert(die.magic);
        }
    };

    const onDieHover = (die) => {
        // highlight cards with dice type
        setMagicHover(die.magic);
    };

    const onFFClick = (cardId) => {
        if (editMode) {
            const card = deck.cards.find((c) => c.id === cardId);
            if (card) {
                card.ff = !card.ff;
                // udpate state & save etc
            }
        }
    };

    const combinedCards = deck.cards.concat(deck.conjurations);
    const cardCount = deck.cards.reduce((agg, val) => agg += val.count, 0);
    return (
        <Col className='deck-summary'>
            <DeckDice
                size='large'
                deck={deck}
                slotCount={10}
                onDieClick={onDieClick}
                onDieHover={onDieHover}
            />
            <div className='deck-cards-header'>
                <ToggleButtonGroup name="radio" value={radioValue}>
                    <ToggleButton
                        key={'rad-0'}
                        id={`radio-0`}
                        type="radio"
                        // variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                        value={false}
                        // checked={radioValue === false}
                        onChange={(e) => setRadioValue(false)}
                        className='mini'
                    >
                        <FontAwesomeIcon icon={faList} title='Show menu' />
                    </ToggleButton>
                    <ToggleButton
                        key={'rad-1'}
                        id={`radio-1`}
                        type="radio"
                        // variant={'outline'}
                        value={true}
                        // checked={radioValue}
                        onChange={(e) => setRadioValue(true)}
                        className='mini'
                    >
                        <FontAwesomeIcon icon={faImage} title='Show menu' />
                    </ToggleButton>
                </ToggleButtonGroup>
                <div className='total-box'>Total: {cardCount}</div>
            </div>
            <Row className='deck-cards'>
                {radioValue ? (
                    <>
                        <div className='basic-title'>First Five</div>
                        <CardListImg deckCards={deck.cards.filter((c) => c.ff)} noIndex={true} />
                        <div className='basic-title'>All Cards</div>

                        <CardListImg deckCards={deck.cards} />
                        <div className='basic-title'>Conjurations</div>
                        <CardListImg deckCards={deck.conjurations} />
                    </>
                ) : (
                    <CardListText deckCards={combinedCards} highlight={magicHover} onFFClick={onFFClick} />
                )}
            </Row>
            <Row>
                <div className='deck-card-group deck-notes'>{deck.notes}</div>
            </Row>
            {deck.played && (
                <Row>
                    <Col xs='10' sm='9'>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    <th>Win</th>
                                    <th>Loss</th>
                                    <th>Total</th>
                                    <th>Win Rate</th>
                                </tr>
                                <tr>
                                    <td>{deck.wins}</td>
                                    <td>{deck.played - deck.wins}</td>
                                    <td>{parseInt(deck.played)}</td>
                                    <td>{deck.winRate?.toFixed(0)}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            )}
        </Col>
    );
};

DeckSummary.displayName = 'DeckSummary';

export default DeckSummary;
