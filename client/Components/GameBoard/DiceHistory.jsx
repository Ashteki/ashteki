import React from 'react';
import './DiceBox.scss';
import MovablePanel from './MovablePanel';
import Die from './Die';
import './DiceHistory.scss';
import CardImage from './CardImage';

const DiceHistory = ({ firstFive, diceHistory, onCloseClick, side }) => {
    return (
        <MovablePanel title='History' name='History' onCloseClick={onCloseClick} side={side}>
            <div className='dice-history'>
                <div>First Five</div>
                <div className='cardHistory'>
                    {(
                        <div key={'cardRoundFF'} className='cardHistoryRow'>
                            {firstFive &&
                                firstFive.map((c, i) => (
                                    <div
                                        key={'first-five' & i}
                                        className='target-card vertical mb-2'
                                    >
                                        <CardImage card={c} />
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td>Dice</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        {diceHistory.map((dh, index) => dh && (
                            <tr key={'diceRound' + index}>
                                <td>{index}</td>
                                {dh.map(
                                    (d, i) => (
                                        <td><Die die={d} /></td>
                                    )
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MovablePanel>
    )
};

export default DiceHistory;
