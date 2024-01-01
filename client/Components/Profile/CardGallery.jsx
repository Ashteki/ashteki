import React from 'react';

import CardImage from '../GameBoard/CardImage';

import './CardGallery.scss';

function CardGallery({ onAltClick, cards = [] }) {
    const cardList = cards;
    return (
        <div className='card-gallery'>
            {cardList.map((c) => (
                <div key={'alt' + (c.alt || c.imageStub)} onClick={() => onAltClick(c.id, c.alt)}>
                    <CardImage card={c} />
                </div>
            ))}
        </div>
    );
}

export default CardGallery;
