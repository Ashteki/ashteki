import React from 'react';
import './MyPairings.scss';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const MyPairings = ({ pairings, onPlayClick }) => {
    const user = useSelector((state) => state.account.user);
    if (!user) {
        return null;
    }

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
        return pairings[league].some((p) => p.pairings.some(pa => userIsInPairing(user.username, pa)));
    };

    const getLeagueName = (tag) => {
        return tag === 'phx' ? 'Phoenix League' : 'First Five League';
    };

    const leagues = ['phx', 'ffl'];
    return (
        <div>
            <div className='lobby-header'>My Pairings</div>

            {leagues.map((l) => {
                if (!userIsInLeague(l)) {
                    return null;
                }
                return (
                    <ul className='pairing-list' key={l}>
                        <div className='lobby-header'>{getLeagueName(l)}</div>

                        {pairings[l].map((p) => {
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
                                                            onClick={() => onPlayClick(i)}
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
                        }
                        )}
                    </ul>)
            }
            )}
        </div>
    );
};

export default MyPairings;