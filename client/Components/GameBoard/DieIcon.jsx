import React from 'react';
import classNames from 'classnames';

import './Die.scss';

const DieIcon = ({ die, disableMouseOver, onMouseOut, onMouseOver }) => {
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
    const readerSpan = <span className='sr-only tiny'>{description}</span>;
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

    return (
        <span
            className={dieClass}
            onMouseOver={!disableMouseOver && onMouseOver ? () => onMouseOver(die) : undefined}
            onMouseOut={!disableMouseOver ? onMouseOut : undefined}
        >
            <span className={diceFont} title={description}>  {readerSpan}</span>

        </span>
    );
};

export default DieIcon;
