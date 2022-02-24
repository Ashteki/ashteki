import React from 'react';
import { imageUrl } from '../../util';

import './CardImage.scss';

/**
 * @typedef CardImageProps
 * @property {object} card // The card data to render an image for
 * @property {string} [cardBack] // The card back image to show if not showing the card image
 */

/**
 *
 * @param {CardImageProps} props
 */
const CardImage = ({ card, cardBack, override }) => {
    let imgPath = card.facedown && !override ? cardBack : imageUrl(card.imageStub || card.id);
    const cardIndex = card.index && !card.facedown ? <div className='card-index'>{card.index}</div> : null;
    return (
        <>
            {cardIndex}
            <img className='img-fluid' src={imgPath} />
        </>
    );
};

export default CardImage;
