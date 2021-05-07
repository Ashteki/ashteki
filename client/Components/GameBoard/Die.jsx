import React, { useState } from 'react';
import CardMenu from './CardMenu';
import classNames from 'classnames';

import './Die.scss';

const Die = ({ die, onClick, onMenuItemClick, disableMouseOver, onMouseOut, onMouseOver }) => {
    const [showDieMenu, setShowDieMenu] = useState(false);

    let diceFont = 'phg-basic-magic';
    let description = die.magic ? die.magic + ' basic' : 'basic die';

    if (die.magic && die.level && die.level !== 'basic') {
        diceFont = `phg-${die.magic}-${die.level}`;
        description = `${die.magic} ${die.level}`;
    }
    if (die.exhausted) {
        description = 'Exhausted ' + description;
    }

    const colorClass = die.location === 'dicepool' && die.exhausted ? 'exhausted' : die.magic;
    const readerSpan = <span className='sr-only'>{description}</span>;
    const getStatusClass = () => {
        if (!die) {
            return undefined;
        }

        if (die.selected) {
            return 'selected';
        } else if (die.selectable) {
            return 'selectable';
        } else if (die.new) {
            return 'new';
        }

        return undefined;
    };

    let statusClass = getStatusClass();
    let dieClass = classNames('die', statusClass, colorClass);

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
        <div className='die-frame'>
            <span
                className={dieClass}
                onClick={(ev) => clickEvent(ev, die)}
                onMouseOver={!disableMouseOver && onMouseOver ? () => onMouseOver(die) : undefined}
                onMouseOut={!disableMouseOver ? onMouseOut : undefined}
            >
                <span aria-hidden='true' className={diceFont} title={description} />
                {readerSpan}
            </span>
            {renderMenu() ? <CardMenu menu={die.menu} onMenuItemClick={onMenuClick} /> : null}
        </div>
    );
};

export default Die;
