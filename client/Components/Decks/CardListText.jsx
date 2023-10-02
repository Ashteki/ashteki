import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import CardImage from '../GameBoard/CardImage';

const CardListText = ({ deckCards }) => {
    let [zoomCard, setZoomCard] = useState(null);
    let [mousePos, setMousePosition] = useState({ x: 0, y: 0 });

    const getCardsToRender = () => {

        let cardsToRender = [];
        let groupedCards = {};

        deckCards.forEach((card) => {
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
                let chainedIcon = null;
                if (card.card.isChained) {
                    chainedIcon = (
                        <FontAwesomeIcon icon={faLink} title='This card is on the chained list' />
                    );
                }
                cards.push(
                    <div key={'text-' + card.card.id}>
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
                        &nbsp;
                        {chainedIcon}
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

    return (
        <>
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
            <div className='cards'>{getCardsToRender(deckCards)}</div>
        </>
    );
};

export default CardListText;
