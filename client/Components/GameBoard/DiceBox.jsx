import React from 'react';
import Die from './Die';

import './DiceBox.scss';

const DiceBox = ({ dice, onDieClick, onMenuItemClick, onMouseOut, onMouseOver, size }) => {
    const getDice = () => {
        return (
            dice
                // .filter(aDie => aDie.level === level)
                // .sort((a, b) => (a.magic + a.level > b.magic + b.level ? -1 : 1))
                .map((thisDie) => (
                    <Die
                        key={thisDie.uuid}
                        die={thisDie}
                        onClick={onDieClick}
                        onMenuItemClick={onMenuItemClick}
                        onMouseOut={onMouseOut}
                        onMouseOver={onMouseOver}
                    />
                ))
        );
    };

    return <div className={`dice ${size}`}>{getDice()}</div>;
};

export default DiceBox;
