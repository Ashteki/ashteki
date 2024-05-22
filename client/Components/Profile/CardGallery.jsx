import React from 'react';

import './CardGallery.scss';
import ZoomableCard from '../Decks/ZoomableCard';

function CardGallery({ onAltClick = () => true, cards = [] }) {
    const cardList = cards;
    return (
        <div className='card-gallery'>
            {cardList.map((c) => (
                <div key={'alt' + (c.alt || c.imageStub)} onClick={() => onAltClick(c.id, c.alt)}>
                    <ZoomableCard card={c} noIndex={true} />
                </div>
            ))}
        </div>
    );
}

export default CardGallery;
