import React, { useEffect } from 'react';
import './LeaguePairings.scss';
import './MyPairings.scss';

import { useDispatch, useSelector } from 'react-redux';
import { getAllPairings, sendSocketMessage } from '../../redux/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const LeaguePairings = ({ onCancelClick, onPlayClick }) => {
    const dispatch = useDispatch();
    const { allPairings, user } = useSelector((state) => ({
        allPairings: state.lobby.allPairings,
        user: state.account.user
    }));

    useEffect(() => {
        dispatch(getAllPairings());
    }, [dispatch]);

    if (!user) {
        return null;
    }
    const playersAreTimerExempt = (pairing) => {
        return [pairing.ashtekiP1, pairing.ashtekiP2].includes('shadowfire');
    };

    const handlePlayClick = (pairing, tag) => {
        onPlayClick();
        const gameName = `${getLeagueName(tag)}: ${pairing.ashtekiP1 || pairing.player1} vs ${pairing.ashtekiP2 || pairing.player2}`
        const isRanked = tag === 'phx';
        const values = {
            name: gameName,
            password: '',
            label: tag.toUpperCase(),
            allowSpectators: true,
            gameType: tag === 'phx' ? 'ranked' : 'casual',
            newGameType: 'league',
            gameFormat: 'constructed',
            useGameTimeLimit: false,
            ranked: isRanked,
            saveReplay: true,
            pairing: pairing,
            league: tag
        };
        // apply time limit to phx
        if (tag === 'phx' && !playersAreTimerExempt(pairing)) {
            values.useGameTimeLimit = true;
            values.gameTimeLimit = 30;
            values.clockType = 'chess';
        }

        // create and then join the game
        dispatch(sendSocketMessage('newgame', values));
    };

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

    const userIsInLeague = (league) => {
        return allPairings[league].some((p) => p.pairings.some(pa => userIsInPairing(user.username, pa)));
    };

    const getLeagueName = (tag) => {
        return tag === 'phx' ? 'Phoenix League' : 'First Five League';
    };

    const leagues = ['phx', 'ffl'];
    return (
        <div>
            <div>
                <div className='lobby-header'>My Pairings</div>

                {allPairings && leagues.map((l) => {
                    const userInLeague = userIsInLeague(l);
                    return (
                        <ul className='pairing-list' key={l}>
                            <div className='lobby-header'>{getLeagueName(l)}</div>

                            {userInLeague ? allPairings[l].map((p) => {
                                return (
                                    <div key={p}>
                                        {p.pairings
                                            .filter((p) => userIsInPairing(user.username, p))
                                            .map((i) => {
                                                const playable = !i.played;
                                                return (

                                                    <li className='pairing' key={i}>
                                                        <div
                                                            className={`decklist-entry-image ${p.tag.toLowerCase()}`}
                                                            title='Phoenix league'
                                                        >
                                                            <span className='sr-only'>PHX</span>
                                                        </div>
                                                        <div>
                                                            <div className='pairing-header'>{i.player1} vs {i.player2}</div>
                                                            <div>{moment(p.datePaired).format('DD-MMM-yy')}</div>
                                                        </div>
                                                        {playable ? (
                                                            <button
                                                                className='btn btn-success def'
                                                                onClick={() => handlePlayClick(i, l)}
                                                            >
                                                                Play
                                                            </button>
                                                        ) : (
                                                            <div className='check-holder'>
                                                                <FontAwesomeIcon icon={faCheck} /></div>
                                                        )}
                                                    </li>
                                                )
                                            })}
                                    </div>
                                )
                            })
                                :
                                <li className='pairing none'>No pairings found. Sign up in the discord!</li>
                            }
                        </ul>)
                }
                )}
            </div>


            <div className='text-center newgame-buttons'>
                <button className='btn btn-primary def' onClick={onCancelClick}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default LeaguePairings;
