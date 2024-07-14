import React from 'react';
import classNames from 'classnames';
import { getCardBack, imageUrl } from '../../util';

import './CardImage.scss';

const CardImage = ({ card, override, noIndex }) => {
    if (!card) {
        return null;
    }

    let imgPath =
        card.facedown && !override
            ? imageUrl(getCardBack(card))
            : imageUrl(card.imageStub || card.id || card.alt);
    const cardIndex =
        card.index && !card.facedown ? (
            <div className='card-index' aria-hidden='true'>
                {card.index}
            </div>
        ) : null;

    let classes = classNames('img-fluid', 'img-card');
    return (
        <>
            {!noIndex && cardIndex}
            <img className={classes} src={imgPath} />
        </>
    );
};

export default CardImage;
