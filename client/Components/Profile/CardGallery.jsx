import React from 'react';
// import PropTypes from 'prop-types';
// import classNames from 'classnames';

import CardImage from '../GameBoard/CardImage';

import './CardGallery.scss';

function CardGallery({ cards = [] }) {
    const cardList = cards;
    return (
        <div className='card-gallery'>
            {cardList.map((c) => <CardImage card={c} key={'alt' + c.id} />)}
        </div>
    );
}

export default CardGallery;
