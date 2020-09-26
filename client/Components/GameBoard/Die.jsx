import React from 'react';

import './Die.scss';

const Die = ({ die, onClick }) => {
    let diceFont = 'phg-basic-magic';

    if (die.magic && die.level && die.level !== 'basic') {
        diceFont = `phg-${die.magic}-${die.level}`;
    }
    const colorClass = die.exhausted ? 'exhausted' : die.magic;

    const clickEvent = (event, die) => {
        event.preventDefault();
        event.stopPropagation();

        if (onClick) {
            onClick(die);
        }
    };

    return (
        <span className={`die ${colorClass}`} onClick={(ev) => clickEvent(ev, die)}>
            <span className={diceFont} title={`${die.magic}`}></span>
        </span>
    );
};

export default Die;
