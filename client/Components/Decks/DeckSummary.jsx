import React, { useState } from 'react';
import { Col, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import './DeckSummary.scss';
import CardListText from './CardListText';
import CardListImg from './CardListImg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faList } from '@fortawesome/free-solid-svg-icons';
import DeckDice from './DeckDice';

const DeckSummary = ({ deck }) => {
    const [radioValue, setRadioValue] = useState(false);

    if (!deck) return null;

    const combinedCards = deck.cards.concat(deck.conjurations);
    const cardCount = deck.cards.reduce((agg, val) => agg += val.count, 0);
    return (
        <Col xs='12' className='deck-summary'>
            <DeckDice deck={deck} slotCount={10} />
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
                {radioValue ? (<>
                    <CardListImg deckCards={deck.cards} />
                    <div className='basic-title'>Conjurations</div>
                    <CardListImg deckCards={deck.conjurations} />
                </>
                ) : (
                    <CardListText deckCards={combinedCards} />
                )}
            </Row>
            <Row>
                <div className='deck-card-group deck-notes'>{deck.notes}</div>
            </Row>
            {deck.played && (
                <Row>
                    <Col xs='10' sm='9'>
                        <table style={{ width: '100%' }}>
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
                        </table>
                    </Col>
                </Row>
            )}
        </Col>
    );
};

DeckSummary.displayName = 'DeckSummary';

export default DeckSummary;
