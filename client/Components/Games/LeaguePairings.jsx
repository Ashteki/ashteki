import React from 'react';
import './LeaguePairings.scss';
import { useDispatch, useSelector } from 'react-redux';
import { clearLeaguePairings, sendSocketMessage } from '../../redux/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import moment from 'moment';

const LeaguePairings = ({ pairings }) => {
    const user = useSelector((state) => state.account.user);
    const dispatch = useDispatch();

    const userIsInPairing = (name, pairing) => {
        if (
            pairing.player1 === name ||
            pairing.player2 === name ||
            name === pairing.ashtekiP1 ||
            name === pairing.ashtekiP2
        ) {
            return true;
        }
        return false;
    };

    const getLeagueName = (tag) => {
        return tag === 'phx' ? 'Phoenix League' : 'First Five League'
    };

    const onPlayClick = (pairing) => {
        const gameName = `${getLeagueName(pairings.tag)}: ${pairing.ashtekiP1 || pairing.player1} vs ${pairing.ashtekiP2 || pairing.player2}`
        const values = {
            name: gameName,
            password: '',
            label: pairings.tag,
            allowSpectators: true,
            gameType: pairings.tag === 'phx' ? 'ranked' : 'casual',
            newGameType: 'league',
            gameFormat: 'constructed',
            useGameTimeLimit: true,
            gameTimeLimit: 60,
            clockType: 'timer',
            ranked: true,
            pairing: pairing,
            league: pairings.tag
        };
        // create and then join the game
        dispatch(sendSocketMessage('newgame', values));
        dispatch(clearLeaguePairings());
    };

    const handleCancelClick = () => {
        dispatch(clearLeaguePairings());
    };

    return (
        <div>
            <h2 className='lobby-header'>{getLeagueName(pairings.tag)}</h2>
            <h3>Latest pairings ({moment(pairings.datePaired).format('DD MMM YYYY')})</h3>
            <div className='league-pairings'>
                {pairings.pairings.map((p) => {
                    const playable = !p.played && userIsInPairing(user.username, p);
                    const pairingClass = classNames('pairing', { playable: playable })
                    return (
                        <div key={p} className={pairingClass}>
                            {p.played ? (
                                <FontAwesomeIcon icon={faCheck} />
                            ) : (
                                <FontAwesomeIcon icon={faSquare} />
                            )}
                            <div className='player'>{p.player1}{p.ashtekiP1 && ` (${p.ashtekiP1})`}</div><span>vs</span>
                            <div className='player'>{p.player2}{p.ashtekiP2 && ` (${p.ashtekiP2})`}</div>
                            {playable && (
                                <button
                                    className='btn btn-success def'
                                    onClick={() => onPlayClick(p)}
                                >
                                    Play
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className='text-center newgame-buttons'>
                <button className='btn btn-primary def' onClick={handleCancelClick}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default LeaguePairings;
