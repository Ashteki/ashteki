import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { sortBy } from 'underscore';
import { useTranslation } from 'react-i18next';
import CardImage from '../GameBoard/CardImage';
import { Constants } from '../../constants';
import Phoenixborn from './Phoenixborn';

import './DeckSummary.scss';

const DeckSummary = ({ deck }) => {
    const { t, i18n } = useTranslation();
    let [zoomCard, setZoomCard] = useState(null);
    let [mousePos, setMousePosition] = useState({ x: 0, y: 0 });

    let output = [];
    const filteredCards = sortBy(deck.cards, (c) => c.card.name);

    for (const card of filteredCards) {
        for (let i = 0; i < card.count; i++) {
            let cardClass = 'deck-card-link';

            output.push(
                <div
                    key={`${card.dbId}${i}`}
                    className={cardClass}
                    onMouseOver={() => setZoomCard(card)}
                    onMouseMove={(event) => {
                        let y = event.clientY;
                        let yPlusHeight = y + 420;

                        if (yPlusHeight >= window.innerHeight) {
                            y -= yPlusHeight - window.innerHeight;
                        }

                        setMousePosition({ x: event.clientX, y: y });
                    }}
                    onMouseOut={() => setZoomCard(null)}
                >
                    {card.card.locale && card.card.locale[i18n.language]
                        ? card.card.locale[i18n.language].name
                        : card.card.name}
                    {card.maverick && (
                        <img className='small-card-icon' src={Constants.MaverickIcon} />
                    )}
                    {card.anomaly && (
                        <img className='small-card-icon' src={Constants.AnomalyIcon} />
                    )}
                </div>
            );
        }
    }

    return (
        <Col xs='12' className='deck-summary'>
            <Row>
                <Col xs='2' sm='3'>
                    <Phoenixborn pbStub={deck.phoenixborn[0].id} />
                </Col>
                <Col xs='8' sm='5'>
                    <Row>
                        <Col xs='7'>
                            <span>{t('Wins')}</span>
                        </Col>
                        <Col xs='5'>{deck.wins}</Col>
                    </Row>
                    <Row>
                        <Col xs='7'>
                            <span>{t('Losses')}</span>
                        </Col>
                        <Col xs='5'>{deck.losses}</Col>
                    </Row>
                    <Row>
                        <Col xs='7'>
                            <span>{t('Total')}</span>
                        </Col>
                        <Col xs='5'>{parseInt(deck.wins) + parseInt(deck.losses)}</Col>
                    </Row>
                    <Row>
                        <Col xs='7'>
                            <span>{t('Win Rate')}</span>
                        </Col>
                        <Col xs='5'>{deck.winRate?.toFixed(2)}%</Col>
                    </Row>
                </Col>
            </Row>
            <Row className='deck-cards'>
                {zoomCard && (
                    <div
                        className='decklist-card-zoom'
                        style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                    >
                        <CardImage
                            card={Object.assign({}, zoomCard, zoomCard.card, zoomCard.cardData)}
                        />
                    </div>
                )}
                <Col sm='4'>{output}</Col>
            </Row>
        </Col>
    );
};

DeckSummary.displayName = 'DeckSummary';

export default DeckSummary;
