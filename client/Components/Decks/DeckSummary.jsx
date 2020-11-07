import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { sortBy } from 'underscore';
import { useTranslation } from 'react-i18next';
import CardImage from '../GameBoard/CardImage';
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
                </div>
            );
        }
    }

    const getCardsToRender = () => {
        let cardsToRender = [];
        let groupedCards = {};

        let combinedCards = deck.cards.concat(deck.conjurations);

        combinedCards.forEach((card) => {
            let type = card.card.type;

            if (type === 'character' || type === 'event') {
                type = card.card.side + ` ${type}`;
            }
            if (!groupedCards[type]) {
                groupedCards[type] = [card];
            } else {
                groupedCards[type].push(card);
            }
        });

        for (let key in groupedCards) {
            let cardList = groupedCards[key];
            let cards = [];
            let count = 0;

            cardList.forEach((card) => {
                cards.push(
                    <div key={card.card.id}>
                        <span>{card.count + 'x '}</span>
                        <span
                            className='card-link'
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
                            {card.card.name}
                        </span>
                    </div>
                );
                count += parseInt(card.count);
            });

            cardsToRender.push(
                <div className='cards-no-break'>
                    <div className='card-group-title'>{key + ' (' + count.toString() + ')'}</div>
                    <div key={key} className='deck-card-group'>
                        {cards}
                    </div>
                </div>
            );
        }

        return cardsToRender;
    };

    var cardsToRender = getCardsToRender();

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
                <div className='cards'>{cardsToRender}</div>
            </Row>
        </Col>
    );
};

DeckSummary.displayName = 'DeckSummary';

export default DeckSummary;
