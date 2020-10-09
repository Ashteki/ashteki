import React from 'react';
import { useTranslation } from 'react-i18next';

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
const CardImage = ({ card, cardBack }) => {
    const { i18n } = useTranslation();
    let imgPath = card.facedown
        ? cardBack
        : `/img/cards/${i18n.language === 'en' ? '' : i18n.language + '/'}${card.id}.png`;
    return (
        <>
            <img className='img-fluid' src={imgPath} />
        </>
    );
};

export default CardImage;
