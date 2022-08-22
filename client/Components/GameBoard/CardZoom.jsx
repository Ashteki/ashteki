import React from 'react';

import CardImage from './CardImage';
import classNames from 'classnames';

import './CardZoom.scss';

const CardZoom = ({ card, cardName, left }) => {
    if (!card || !card.id) {
        return null;
    }

    const size = card.type === 'decklist' ? 'x-large' : 'normal';
    return (
        <div className={classNames(`card-zoom`, size, `vertical`, { left: left })}>
            {
                <div className='card-zoomed shadow'>
                    {card.imageUrl ? (
                        <div className='card-zoomed shadow'>
                            <img className={`image-zoom ${size} img-fluid`} src={card.imageUrl} />
                        </div>
                    ) : (
                        <div className='card-zoomed shadow'>
                            <span className='card-name'>{cardName}</span>
                            <CardImage card={card} override={true} />
                        </div>
                    )}
                </div>
            }
        </div>
    );
};

CardZoom.displayName = 'CardZoom';

export default CardZoom;
