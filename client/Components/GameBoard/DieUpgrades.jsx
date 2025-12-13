import React from 'react';
import Die from './Die';
import './DieUpgrades.scss';
import classNames from 'classnames';

const DieUpgrades = ({ card, onDieClick }) => {
    const dice =
        card.dieUpgrades && card.dieUpgrades.length > 0
            ? card.dieUpgrades.map((d) => (
                <Die key={'dup-' + d.uuid} die={d} onClick={onDieClick} />
            ))
            : null;

    const classes = classNames('die-upgrades', {
        squish: dice && dice.length > 2
    });

    return <div className={classes}>{dice}</div>;
};

DieUpgrades.displayName = 'DieUpgrades';

export default DieUpgrades;
