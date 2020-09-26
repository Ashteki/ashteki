import React, { useState } from 'react';
import CardMenu from './CardMenu';

import './Die.scss';

const Die = ({ die, onClick, onMenuItemClick }) => {
    const [showMenu, setShowMenu] = useState(false);

    let diceFont = 'phg-basic-magic';

    if (die.magic && die.level && die.level !== 'basic') {
        diceFont = `phg-${die.magic}-${die.level}`;
    }
    const colorClass = die.exhausted ? 'exhausted' : die.magic;

    const clickEvent = (event, die) => {
        event.preventDefault();
        event.stopPropagation();

        if (
            // isAllowedMenuSource() &&
            die.menu &&
            die.menu.length !== 0
        ) {
            setShowMenu(!showMenu);

            return;
        }

        if (onClick) {
            onClick(die);
        }
    };

    const onMenuClick = (menuItem) => {
        if (onMenuItemClick) {
            onMenuItemClick(die, menuItem);
            setShowMenu(!showMenu);
        }
    };

    const renderMenu = () => {
        if (!die.menu || !showMenu) {
            return false;
        }

        return true;
    };

    return (
        <div className='die-frame'>
            <span className={`die ${colorClass}`} onClick={(ev) => clickEvent(ev, die)}>
                <span className={diceFont} title={`${die.magic}`}></span>
            </span>
            {renderMenu() ? <CardMenu menu={die.menu} onMenuItemClick={onMenuClick} /> : null}
        </div>
    );
};

export default Die;
