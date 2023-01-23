import React from 'react';
import classNames from 'classnames';
import { imageUrl } from '../../util';

import './CardImage.scss';

const CardImage = ({ card, cardBack, override, imgClass }) => {
    if (!card) {
        return null;
    }
    let classes = classNames('img-fluid', imgClass);

    let imgPath = card.facedown && !override ? cardBack : imageUrl(card.imageStub || card.id);
    const cardIndex =
        card.index && !card.facedown ? (
            <div className='card-index' aria-hidden='true'>
                {card.index}
            </div>
        ) : null;
    return (
        <>
            {cardIndex}
            <img className={classes} src={imgPath} />
        </>
    );
};

export default CardImage;
