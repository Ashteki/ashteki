import React, { useState } from 'react';
import { isSafari } from 'react-device-detect';
import CardImage from './CardImage';
import classNames from 'classnames';
import attackIcon from '../../assets/img/attack-icon.png';
import medIcon from '../../assets/img/meditate-icon.png';
import passIcon from '../../assets/img/pass-icon.png';

import './CardZoom.scss';
import './Cardlog.scss';
import DieIcon from './DieIcon';

const CardLogEx = ({ items, onMouseOut, onMouseOver }) => {
    const [show, setShow] = useState(true);

    if (!items) {
        return null;
    }

    const renderItem = (item, last = false) => {
        const actionClass = 'action-' + item.type;

        if (item.type === 'attack') {
            return (
                <div key={item.id} className='log-card'>
                    <div className='x-large cardlog-icon'>
                        <img className='log-icon' title='Attack!' src={attackIcon} />
                    </div>
                    <div className='log-info'>
                        {item.p} <span className={actionClass}>attacks</span> {item.obj.name}
                    </div>
                </div>
            );
        }
        if (item.type === 'med') {
            return (
                <div key={item.id} className='log-card'>
                    <div className='x-large cardlog-icon'>
                        <img className='log-icon' title={item.obj.name + ' meditates'} src={medIcon} />
                    </div>
                    <div className='log-info'>
                        {item.obj.name} <span className={actionClass}>meditates</span>
                    </div>
                </div>
            );
        }

        if (item.type === 'pass') {
            return (
                <div key={item.id} className='log-card'>
                    <div className='x-large cardlog-icon'>
                        <img className='log-icon' title={item.obj.name + ' passes'} src={passIcon} />
                    </div>
                    <div className='log-info'>
                        {item.obj.name} <span className={actionClass}>passes</span>
                    </div>
                </div>
            );
        }

        if (item.obj.type === 'die') {
            const die = item.obj;
            return (
                <div key={item.id} className='log-card'>
                    <div className='x-large cardlog-icon'>
                        <DieIcon key={'cld-' + die.uuid} die={die} />
                    </div>
                    <div className='log-info'>
                        {item.p} <span className={actionClass}>uses</span> dice power
                    </div>
                </div>

            )
        }

        // now it's a card
        if (!item.obj.id) return '';

        const actionText = item.type === 'play' ? 'plays' : 'uses';

        return (
            <div
                key={item.id}
                className='log-card'
                onMouseOut={() => onMouseOut && onMouseOut(item.obj)}
                onMouseOver={() => onMouseOver && onMouseOver(item.obj)}
            >
                <CardImage card={item.obj} noIndex={true} />
                <div className='log-info'>{item.p} <span className={actionClass}>{actionText}</span>  {item.obj.name}
                </div>
            </div>
        );
    };

    return <div className='cardlogex-wrapper'>{items.map((i) => renderItem(i))}</div>;
};

CardLogEx.displayName = 'CardLog';

export default CardLogEx;
