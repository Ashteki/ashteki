import React, { useState } from 'react';
import { isSafari } from 'react-device-detect';
import CardImage from './CardImage';

import './CardZoom.scss';
import './Cardlog.scss';
import DieIcon from './DieIcon';

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
                    <DieIcon key={'cld-' + card.uuid} die={card} />
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
                    <DieIcon key={'cld-' + card.uuid} die={card} />
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

    let logLength = cards.length - 1;
    if (isSafari) {
        logLength = Math.min(3, logLength);
    }

    const cardPics =
        cards.length > 1 ? cards.slice(0, logLength).map((c) => renderSimpleCard(c)) : null;
    const firstCard = cards.length ? renderLastCard(cards[logLength]) : null;
    // const size = card.type === 'decklist' ? 'x-large' : 'normal';
    const arrow = show ? '︿' : '﹀';
    return (
        <div className='cardlog-wrapper'>
            {firstCard}
            <div className='card-log bg-dark'>
                {cardPics}
                <div className='card-log-arrow' onClick={() => setShow(!show)}>
                    {arrow}
                </div>
            </div>
        </div>
    );
};

CardLog.displayName = 'CardLog';

export default CardLog;
