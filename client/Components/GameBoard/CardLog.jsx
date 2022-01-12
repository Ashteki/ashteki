import React, { useState } from 'react';

import CardImage from './CardImage';
import Die from './Die';

import './CardZoom.scss';
import './Cardlog.scss';

const CardLog = ({ cards, onMouseOut, onMouseOver }) => {
    const [show, setShow] = useState(true);

    if (!cards) {
        return null;
    }

    const renderSimpleCard = (card) => {
        if (!show) return '';

        if (card.type === 'die') {
            return (
                <div className='x-large cardlog-die mb-2'>
                    <Die key={'cld-' + card.uuid} die={card} />
                </div>
            )
        }

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

    const renderLastCard = (card) => {
        if (card.type === 'die') {
            return (
                <div className='x-large cardlog-die mb-2'>
                    <Die key={'cld-' + card.uuid} die={card} />
                </div>
            )
        }

        if (!card.id) return '';

        return (
            <div
                className='last-card vertical mb-2'
                onMouseOut={() => onMouseOut && onMouseOut(card)}
                onMouseOver={() => onMouseOver && onMouseOver(card)}
            >
                <CardImage card={card} />
            </div>
        );
    };

    const cardPics = cards.length > 1 ? cards.slice(0, cards.length - 1).map((c) => renderSimpleCard(c)) : null;
    const firstCard = cards.length ? renderLastCard(cards[cards.length - 1]) : null;
    // const size = card.type === 'decklist' ? 'x-large' : 'normal';
    const arrow = show ? '︿' : '﹀';
    return (
        <div className='cardlog-wrapper'        >
            {firstCard}
            < div className='card-log bg-dark' >
                {cardPics}
                < div className='card-log-arrow' onClick={() => setShow(!show)}>
                    {arrow}
                </div >
            </div >

        </div>);
};

CardLog.displayName = 'CardLog';

export default CardLog;
