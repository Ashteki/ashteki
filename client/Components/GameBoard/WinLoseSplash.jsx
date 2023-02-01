import React from 'react';
import { useDispatch } from 'react-redux';
import { closeGameSocket, sendGameMessage } from '../../redux/actions';
import Panel from '../Site/Panel';
import CardImage from './CardImage';

import './WinLoseSplash.scss';

const WinLoseSplash = ({ game, onCloseClick }) => {
    const dispatch = useDispatch();

    const onLeaveClick = () => {
        dispatch(sendGameMessage('leavegame'));
        dispatch(closeGameSocket());
    };

    let loser = null;
    let winner = null;

    for (const player in game.players) {
        const p = game.players[player];
        if (p.name === game.winner) {
            winner = p;
        } else {
            loser = p;
        }
    }

    const headerMessage = winner?.name + ' ' + 'wins!';
    const card = winner?.phoenixborn;
    // const winner = game.players[game.winner];
    return (
        <Panel title='Game Over' cardClass={`splash`} onCloseClick={onCloseClick}>
            <CardImage card={card} />
            <div className='central'>
                <h2>{headerMessage}</h2>
                <div className='buttonDiv'>
                    <button
                        onClick={onLeaveClick}
                        className='btn splash-button btn-default'
                    >Leave Game</button>
                    <button
                        onClick={onCloseClick}
                        className='btn splash-button btn-primary'
                    >Close</button>
                </div>
            </div>
            {/* <CardImage card={loser.phoenixborn} imgClass='splash-loser' /> */}
        </Panel>
    );
};

export default WinLoseSplash;
