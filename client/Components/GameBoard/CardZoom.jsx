import React from 'react';

import CardImage from './CardImage';
import classNames from 'classnames';

import './CardZoom.scss';
import { useDispatch } from 'react-redux';
import { clearZoom } from '../../redux/actions';

const CardZoom = ({ card, cardName, cardSize }) => {
    const dispatch = useDispatch();

    if (!card || !card.id) {
        return null;
    }

    const onZoomClick = (event) => {
        dispatch(clearZoom());
        event.stopPropagation();
    };

    const size = cardSize;
    return (
        <div className={classNames(`card-zoom`, size, `vertical`, { left: false })} onClick={onZoomClick}>
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
