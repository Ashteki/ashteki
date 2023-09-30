import React, { useState } from 'react';
import { ButtonGroup, Col, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import ZoomableCard from './ZoomableCard';
import DeckStatus from './DeckStatus';
import DeckStatusSummary from './DeckStatusSummary';

import './DeckSummary.scss';
import DieIcon from '../GameBoard/DieIcon';
import CardListText from './CardListText';
import CardListImg from './CardListImg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faImage, faList } from '@fortawesome/free-solid-svg-icons';

const DeckSummary = ({ deck }) => {
    const [radioValue, setRadioValue] = useState(false);

    if (!deck) return null;

    const combinedCards = deck.cards.concat(deck.conjurations);

    const getDiceToRender = () => {
        const diceToRender = [];
        if (deck.dicepool) {
            deck.dicepool
                .sort((a, b) => (a.magic < b.magic ? -1 : 1))
                .forEach((diceCount) => {
                    for (let i = 0; i < diceCount.count; i++) {
                        diceToRender.push(
                            <DieIcon die={{ magic: diceCount.magic, level: 'power' }} />
                        );
                    }
                });
        }
        return (
            <div>
                <div className='flex'> {diceToRender}</div>
            </div>
        );
    };

    var diceToRender = getDiceToRender();
    var phoenixbornStub = deck.phoenixborn.length > 0 ? deck.phoenixborn[0].card.imageStub : '';

    return (
        <Col xs='12' className='deck-summary'>
            <Row>
                <Col xs='2' sm='3'>
                    <ZoomableCard pbStub={phoenixbornStub} />
                </Col>
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

                    <Row>
                        <Col xs='8'>
                            <DeckStatusSummary status={deck.status} />
                        </Col>
                        <Col xs='4'>
                            <DeckStatus status={deck.status} />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <div className='large'>{diceToRender}</div>
            </Row>
            <Row>
                <ToggleButtonGroup name="radio" value={radioValue}>
                    <ToggleButton
                        key={'rad-0'}
                        id={`radio-0`}
                        type="radio"
                        // variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                        value={false}
                        // checked={radioValue === false}
                        onChange={(e) => setRadioValue(false)}
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
                    >
                        <FontAwesomeIcon icon={faImage} title='Show menu' />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Row>
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
        </Col>
    );
};

DeckSummary.displayName = 'DeckSummary';

export default DeckSummary;
