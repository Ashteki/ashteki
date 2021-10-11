import React, { useState } from 'react';

import CardImage from './CardImage';
import Die from './Die';

import './CardZoom.scss';

const CardLog = ({ cards, onMouseOut, onMouseOver }) => {
    const [show, setShow] = useState(true);

    if (!cards) {
        return null;
    }

    const renderSimpleCard = (card) => {
        if (card.type === 'die') {
            return (
                <div className='x-large cardlog-die mb-2'>
                    <Die key={'cld-' + card.uuid} die={card} />
                </div>
            )
        }

        if (!card.id || !show) return '';

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
    const arrow = show ? '︿' : '﹀';
    return (
        <div className='card-log bg-dark'>
            {cardPics}
            <div className='card-log-arrow' onClick={() => setShow(!show)}>
                {arrow}
            </div>
        </div>
    );
};

CardLog.displayName = 'CardLog';

export default CardLog;
