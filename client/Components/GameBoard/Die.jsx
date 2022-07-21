import React, { useState } from 'react';
import CardMenu from './CardMenu';

import './Die.scss';
import DieIcon from './DieIcon';

const Die = ({ die, onClick, onMenuItemClick, disableMouseOver, onMouseOut, onMouseOver }) => {
    const [showDieMenu, setShowDieMenu] = useState(false);

    let description = die.magic ? die.magic + ' basic' : 'basic die';
    if (die.magic && die.level && die.level !== 'basic') {
        description = `${die.magic} ${die.level}`;
    }
    if (die.exhausted) {
        description = 'Exhausted ' + description;
    }

    const clickEvent = (event, die) => {
        event.preventDefault();
        event.stopPropagation();

        if (
            // isAllowedMenuSource() &&
            die.menu &&
            die.menu.length !== 0
        ) {
            setShowDieMenu(!showDieMenu);

            return;
        }

        if (onClick) {
            onClick(die);
        }
    };

    const onMenuClick = (menuItem) => {
        if (onMenuItemClick) {
            onMenuItemClick(die, menuItem);
            setShowDieMenu(!showDieMenu);
        }
    };

    const renderMenu = () => {
        if (!die.menu || !showDieMenu) {
            return false;
        }

        return true;
    };

    return (
        <div className='die-frame' onClick={(ev) => clickEvent(ev, die)}>
            <DieIcon
                die={die}
                disableMouseOver={disableMouseOver}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
            />
            {renderMenu() ? <CardMenu menu={die.menu} onMenuItemClick={onMenuClick} /> : null}
        </div>
    );
};

export default Die;
