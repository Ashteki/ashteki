import React from 'react';
import DieIcon from '../GameBoard/DieIcon';
import DieSlot from '../GameBoard/DieSlot';
import './DeckDice.scss';
import classNames from 'classnames';

const DeckDice = ({ deck, onDieClick, onDieHover, size }) => {
    const getDiceToRender = () => {
        const diceToRender = [];
        if (deck.dicepool) {
            deck.dicepool
                .sort((a, b) => (a.magic < b.magic ? -1 : 1))
                .forEach((diceCount) => {
                    for (let i = 0; i < diceCount.count; i++) {
                        diceToRender.push(
                            <DieIcon
                                die={{ magic: diceCount.magic, level: 'power' }}
                                onClick={() => onDieClick({ magic: diceCount.magic })}
                                onMouseOver={() => onDieHover({ magic: diceCount.magic })}
                                onMouseOut={() => onDieHover({ magic: '' })}
                            />
                        );
                    }
                });
        }
        for (let i = diceToRender.length; i < 10; i++) {
            diceToRender.push(<DieSlot />);
        }
        return diceToRender;
    };

    var diceToRender = getDiceToRender();
    const ddClasses = classNames('deck-dice', {
        large: size === 'large'
    });
    return <div className={ddClasses}>{diceToRender}</div>;
};

export default DeckDice;
