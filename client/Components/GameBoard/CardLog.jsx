import React from 'react';

import CardImage from './CardImage';

import './CardZoom.scss';

const CardLog = ({ cards, onMouseOut, onMouseOver }) => {
    if (!cards) {
        return null;
    }

    const renderSimpleCard = (card) => {
        if (!card.id) return '';

        return (
            <div
                className='target-card vertical mb-2'
                onMouseOut={() => onMouseOut && onMouseOut(card)}
                onMouseOver={() => onMouseOver && onMouseOver(card)}
            >
                <CardImage card={card} />
            </div>
        );
    };

    const cardPics = cards.map((c) => renderSimpleCard(c));

    // const size = card.type === 'decklist' ? 'x-large' : 'normal';

    return (
        <div className='card-log bg-dark'>
            {cardPics}
            <div className='card-log-arrow'>&#65087;</div>
        </div>
    );
};

CardLog.displayName = 'CardLog';

export default CardLog;
