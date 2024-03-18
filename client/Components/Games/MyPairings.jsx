import React from 'react';
import './MyPairings.scss';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

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

    const getLeagueName = (tag) => {
        return tag === 'phx' ? 'Phoenix League' : 'First Five League';
    };

    return (
        <div>
            <div className='lobby-header'>My Pairings</div>
            <ul className='pairing-list'>
                {pairings.map((p) => {
                    const playable = !p.played && userIsInPairing(user.username, p);
                    return (

                        <li className='pairing' key={p}>
                            <div
                                className={`decklist-entry-image ${p.tag.toLowerCase()}`}
                                title='Phoenix league'
                            >
                                <span className='sr-only'>PHX</span>
                            </div>
                            <div>
                                <div className='pairing-header'>{p.source} ({p.date})</div>
                                <div>{p.player1} vs {p.player2}</div>
                            </div>
                            {playable ? (
                                <button
                                    className='btn btn-success def'
                                    onClick={() => onPlayClick(p)}
                                >
                                    Play
                                </button>
                            ) : (
                                <div className='check-holder'>
                                    <FontAwesomeIcon icon={faCheck} /></div>
                            )}
                        </li>
                    )
                }
                )}
            </ul>
        </div>
    );
};

export default MyPairings;