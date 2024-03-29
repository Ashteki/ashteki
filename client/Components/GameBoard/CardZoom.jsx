import React from 'react';

import CardImage from './CardImage';
import classNames from 'classnames';

import './CardZoom.scss';

const CardZoom = ({ card, cardName, cardSize }) => {
    if (!card || !card.id) {
        return null;
    }

    const size = cardSize;
    return (
        <div className={classNames(`card-zoom`, size, `vertical`, { left: false })}>
            {card.imageUrl ? (
                <div className='card-zoomed shadow'>
                    <img className={`image-zoom ${size} img-fluid`} src={card.imageUrl} />
                </div>
            ) : (
                <div className='card-zoomed shadow'>
                    <CardImage card={card} override={true} noIndex={true} />
                </div>
            )}
        </div>
    );
};

CardZoom.displayName = 'CardZoom';

export default CardZoom;
