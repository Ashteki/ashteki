import React from 'react';
import './DiceBox.scss';
import MovablePanel from './MovablePanel';
import Die from './Die';
import './DiceHistory.scss';

const DiceHistory = ({ diceHistory, onCloseClick, side }) => {

    return <MovablePanel title='Dice History' name='Dice History'
        onCloseClick={onCloseClick}
        side={side}
    >
        <div className='dice-history'>
            <table>
                <tbody>
                    <tr>
                        <td>Round</td>
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
};

export default DiceHistory;
