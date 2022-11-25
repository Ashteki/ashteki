import React from 'react';
import { useDispatch } from 'react-redux';
import { closeGameSocket, sendGameMessage } from '../../redux/actions';
import Panel from '../Site/Panel';
import CardImage from './CardImage';

import './WinLoseSplash.scss';

const WinLoseSplash = ({ game }) => {
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
        <Panel title='Game Over' cardClass={`splash`}>
            <>
                <CardImage card={card} />
                <div className='central'>
                    <h2>{headerMessage}</h2>
                    <button
                        onClick={onLeaveClick}
                        className='btn prompt-button btn-default'
                    >Leave</button>
                </div>
                {/* <CardImage card={loser.phoenixborn} imgClass='splash-loser' /> */}
            </>

        </Panel>
    );
};

export default WinLoseSplash;
