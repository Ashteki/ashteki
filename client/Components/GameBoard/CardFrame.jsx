import React from 'react';
import classNames from 'classnames';

const CardFrame = ({ cardSize }) => {
    const sizeClass = {
        [cardSize]: cardSize !== 'normal'
    };
    let cardClass = classNames('game-card', 'vertical', sizeClass);

    return (
        <div className={'card-wrapper'}>
            <div className='card-frame'>
                <div className={cardClass} />
            </div>
        </div>
    );
};

export default CardFrame;
