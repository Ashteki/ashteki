import React, { useState } from 'react';
import { isSafari } from 'react-device-detect';
import CardImage from './CardImage';
import classNames from 'classnames';
import attackIcon from '../../assets/img/attack-icon.png';
import medIcon from '../../assets/img/meditate-icon.png';

import './CardZoom.scss';
import './Cardlog.scss';
import DieIcon from './DieIcon';

const CardLog = ({ items, onMouseOut, onMouseOver }) => {
    const [show, setShow] = useState(true);

    if (!items) {
        return null;
    }
    const renderDieUsed = (die) => {
        return (
            <div className='x-large cardlog-die mb-2'>
                <DieIcon key={'cld-' + die.uuid} die={die} />
            </div>
        )
    }

    const renderAttack = (attack) => {
        return (
            <div className='x-large cardlog-die mb-2'>
                <img className='log-icon' title='Attack!' src={attackIcon} />
            </div>
        )
    }
    const renderMed = (obj) => {
        return (
            <div className='x-large cardlog-die mb-2'>
                <img className='log-icon' title={obj.name + ' meditates'} src={medIcon} />
            </div>
        )
    }

    const renderItem = (item, last = false) => {
        if (item.type === 'attack') {
            return renderAttack(item.obj);
        }
        if (item.type === 'med') {
            return renderMed(item.obj);
        }

        if (item.obj.type === 'die') {
            return renderDieUsed(item.obj);
        }

        // now it's a card
        if (!item.obj.id) return '';
        const itemClass = classNames(
            'vertical mb-2',
            last ? 'last-card' : 'target-card'
        );

        return (
            <div
                className={itemClass}
                onMouseOut={() => onMouseOut && onMouseOut(item.obj)}
                onMouseOver={() => onMouseOver && onMouseOver(item.obj)}
            >
                <CardImage card={item.obj} />
            </div>
        );
    };

    let logLength = items.length - 1;
    if (isSafari) {
        logLength = Math.min(3, logLength);
    }

    const cardPics = items.length > 1
        ? items.slice(0, logLength).map((c) => renderItem(c))
        : null;
    const firstCard = items.length
        ? renderItem(items[logLength], true)
        : null;
    // const size = card.type === 'decklist' ? 'x-large' : 'normal';
    const arrow = show ? '︿' : '﹀';
    return (
        <div className='cardlog-wrapper'>
            {firstCard}
            <div className='card-log bg-dark'>

                {show && cardPics}
                <div className='card-log-arrow' onClick={() => setShow(!show)}>
                    {arrow}
                </div>
            </div>
        </div>
    );
};

CardLog.displayName = 'CardLog';

export default CardLog;
