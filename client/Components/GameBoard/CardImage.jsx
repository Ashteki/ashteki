import React from 'react';
import classNames from 'classnames';
import { imageUrl } from '../../util';

import './CardImage.scss';

const CardImage = ({ card, cardBack, override, noIndex }) => {
    if (!card) {
        return null;
    }

    let imgPath = card.facedown && !override ? cardBack : imageUrl(card.imageStub || card.id || card.alt);
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
