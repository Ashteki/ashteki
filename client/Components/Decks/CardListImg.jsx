import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import CardImage from '../GameBoard/CardImage';
import ZoomableCard from './ZoomableCard';

const CardListImg = ({ deckCards }) => {

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

        cardList.forEach((card) => {
            const cardProps = Object.assign({ index: card.count }, card, card.card, card.cardData);
            cardsToRender.push(cardProps);
        });
    }

    return (
        <div className='cards'>
            {cardsToRender.map((card) => (
                <div key={card.id} className='game-card large vertical'>
                    <ZoomableCard card={card} />
                    {card.isChained && (
                        <FontAwesomeIcon
                            className='card-chain-bad'
                            icon={faLink}
                            title='This card is on the chained list'
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default CardListImg;
