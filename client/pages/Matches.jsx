import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { loadUserGames } from '../redux/actions';

const Matches = () => {
    const dispatch = useDispatch();
    const games = useSelector((state) => state.games.games);
    const [term, setTerm] = useState(1);
    const [gameType, setGameType] = useState('');

    useEffect(() => {
        dispatch(loadUserGames(term, gameType));
    }, [dispatch, term, gameType]);

    const handleTermChange = (event) => {
        setTerm(event.target.value);
        event.stopPropagation();
    };

    const handleTypeChange = (event) => {
        setGameType(event.target.value);
        event.stopPropagation();
    };

    const computeWinner = (game) => {
        if (
            !game.winner ||
            game.winner === game.players[0].name ||
            game.winner === game.players[1].name
        ) {
            return game.winner;
        }

        if (game.winner === game.players[0].deck) {
            return game.players[0].name;
        }

        if (game.winner === game.players[1].deck) {
            return game.players[1].name;
        }
    };

    const gameApiRoot = `${window.location.protocol}//${window.location.host}/api/game/`;

    return (
        <div className='col-sm-offset-1 profile full-height'>
            <div className='col-md-6 inline'>
                <select className='form-control' onChange={handleTermChange} value={term}>
                    <option value='0'>All games</option>
                    <option value='1'>Last 1 month</option>
                    <option value='3'>Last 3 months</option>
                    <option value='12'>Last 12 months</option>
                </select>
            </div>
            <div className='col-md-6 inline'>
                <select className='form-control' onChange={handleTypeChange}>
                    <option value=''>All Types</option>
                    <option value='competitive'>Ranked</option>
                    <option value='casual'>Casual</option>
                </select>
            </div>

            {games && games.length === 0 ? (
                <div>You have no recorded games.</div>
            ) : (
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>My Deck</th>
                            <th>Opponent</th>
                            <th>Winner</th>
                            <th>Ranked</th>
                            <th>details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games &&
                            games.map((game) => {
                                const startedAt = moment(game.startedAt);
                                const finishedAt = moment(game.finishedAt);
                                const duration = moment.duration(finishedAt.diff(startedAt));

                                return (
                                    <tr key={game.gameId}>
                                        <td>{moment(game.startedAt).format('YYYY-MM-DD HH:mm')}<br />
                                            <b>{game.label}</b></td>
                                        <td>{game.players[0].deck}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            {game.players[1]?.name}
                                            <br />
                                            {game.players[1]?.deck}
                                        </td>
                                        <td>
                                            {computeWinner(game)}
                                            <br />({game.winReason})
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            {game.gameType === 'competitive' ? 'Y' : ''}
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            <a href={gameApiRoot + game.gameId} download={true}>
                                                {game.gameId}
                                            </a>
                                            <br />
                                            {duration.get('hours')}h {duration.get('minutes')}m
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Matches;
