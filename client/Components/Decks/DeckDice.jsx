import React from 'react';
import DieIcon from '../GameBoard/DieIcon';
import DieSlot from '../GameBoard/DieSlot';
import './DeckDice.scss';

const DeckDice = ({ deck }) => {
    const getDiceToRender = () => {
        const diceToRender = [];
        if (deck.dicepool) {
            deck.dicepool
                .sort((a, b) => (a.magic < b.magic ? -1 : 1))
                .forEach((diceCount) => {
                    for (let i = 0; i < diceCount.count; i++) {
                        diceToRender.push(
                            <DieIcon die={{ magic: diceCount.magic, level: 'power' }} />
                        );
                    }
                });
        }
        for (let i = diceToRender.length; i < 10; i++) {
            diceToRender.push(<DieSlot />);
        }
        return (
            <div className='flex'> {diceToRender}</div>
        );
    };

    var diceToRender = getDiceToRender();

    return <div className='deck-dice'><div className='large'>{diceToRender}</div></div>;
};

export default DeckDice;
