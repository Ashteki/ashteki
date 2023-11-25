import React from 'react';
import { useDispatch } from 'react-redux';
import { closeGameSocket, sendGameMessage } from '../../redux/actions';
import Panel from '../Site/Panel';
import CardImage from './CardImage';
import cardsLogo from '../../assets/img/ShowHandIcon.png';

import './WinLoseSplash.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faDroplet } from '@fortawesome/free-solid-svg-icons';

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
                <div className='splash-stats-box'>
                    <div className='stat header'>
                        <div className={`decklist-entry-image ${winner.phoenixborn.id}`} />
                        <div className='stat-vs'>Vs</div>
                        <div className={`decklist-entry-image ${loser.phoenixborn.id}`} />
                    </div>
                    <div className='stat'>
                        {winner.totalDiceSpend}
                        <FontAwesomeIcon icon={faDice} className='stat-icon' title='Dice spent' />
                        {loser.totalDiceSpend}
                    </div>
                    <div className='stat'>
                        {winner.totalCardsPlayed}
                        <img
                            src={cardsLogo}
                            className='stat-icon cards-icon'
                            title='Cards played'
                        />
                        {loser.totalCardsPlayed}
                    </div>
                    <div className='stat'>{winner.phoenixborn.damage}
                        <FontAwesomeIcon
                            icon={faDroplet}
                            className='blood-stat-icon'
                            title='Final Wounds'
                        />
                        {loser.phoenixborn.damage}
                    </div>
                </div>
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
        </Panel>
    );
};

export default WinLoseSplash;
