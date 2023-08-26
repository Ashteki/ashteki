import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import CardImage from '../GameBoard/CardImage';



const CardListImg = ({ deckCards }) => {
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
                const cardProp = Object.assign(
                    { index: card.count },
                    card,
                    card.card,
                    card.cardData
                );

                cards.push(
                    <div key={card.card.id} className='game-card large vertical'>
                        <CardImage card={cardProp} />
                    </div>
                );
                count += parseInt(card.count);
            });

            cardsToRender.push(
                // <div className='cards-no-break-100'>
                //     <div className='card-group-title'>{key + ' (' + count.toString() + ')'}</div>
                // <div key={key} className='deck-card-group flex'>
                cards
                // </div>
                // </div>
            );
        }

        return cardsToRender;
    };

    return (
        // <div className='deck-card-group flex'>
        <div className='cards'>{getCardsToRender(deckCards)}</div>
        // </div>
    );
};

export default CardListImg;
