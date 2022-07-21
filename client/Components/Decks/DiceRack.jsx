import React from 'react';
import './DiceRack.scss';
import DieIcon from '../GameBoard/DieIcon';
import { MagicTypes } from '../../constants';


const DiceRack = ({ dice }) => {
    const output = MagicTypes.map((mt) => {
        const d = {
            magic: mt,
            level: 'power',
            exhausted: true,
            location: 'dicepool'
        };
        if (dice.some(die => die.magic === mt)) {
            d.exhausted = false;
        }
        return <DieIcon key={'cld-' + d.uuid} die={d} simpleText='true' />;
    });

    return (
        <div className='dice-rack' aria-hidden='true'>
            {output}
        </div>
    );
};

export default DiceRack;
