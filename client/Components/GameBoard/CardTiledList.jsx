import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card';

import './CardTiledList.scss';

function CardTiledList(props) {
    let cardList =
        props.cards &&
        props.cards.map((card, index) => {
            return (
                <Card
                    canDrag={props.manualMode}
                    card={card}
                    disableMouseOver={props.disableMouseOver}
                    key={index}
                    onClick={props.onCardClick}
                    onAltClick={props.onCardAltClick}
                    onMouseOut={props.onCardMouseOut}
                    onMouseOver={props.onCardMouseOver}
                    onTouchMove={props.onTouchMove}
                    orientation='vertical'
                    showChains={props.showChains}
                    size={props.size}
                    source={props.source}
                />
            );
        });

    return (
        <div className='card-list-cards'>{cardList}</div>
    );
}

CardTiledList.propTypes = {
    cards: PropTypes.array,
    disableMouseOver: PropTypes.bool,
    manualMode: PropTypes.bool,
    onCardClick: PropTypes.func,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    onTouchMove: PropTypes.func,
    size: PropTypes.string,
    source: PropTypes.string,
    title: PropTypes.string,
    titleCount: PropTypes.number
};

export default CardTiledList;
