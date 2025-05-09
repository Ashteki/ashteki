import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

const TaggedGameList = () => {
    const taggedGames = useSelector((state) => state.games.taggedGames);

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

    const computeWinnerIndex = (game) => {
        return game.winner === game.players[0].name ? 0 : 1;
    };

    const gameApiRoot = `${window.location.protocol}//${window.location.host}/api/game/`;

    return taggedGames && taggedGames.length === 0 ? (
        <div>No matching games.</div>
    ) : (
        <table className='table table-striped'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Player 1</th>
                    <th>Pb 1</th>
                    <th>Player 2</th>
                    <th>Pb 2</th>
                    <th>Winner</th>
                    <th>Reason</th>
                    <th>BP</th>
                    <th>Paired?</th>
                    <th>details</th>
                </tr>
            </thead>
            <tbody>
                {taggedGames && taggedGames.map((game) => {
                    const startedAt = moment(game.startedAt);
                    const finishedAt = moment(game.finishedAt);
                    const duration = moment.duration(finishedAt.diff(startedAt));

                    const winnerIndex = game.winner ? computeWinnerIndex(game) : -1;

                    return (
                        <tr key={game.gameId}>
                            <td>{moment(game.startedAt).format('YYYY-MM-DD HH:mm')}<br />
                                {game.label}</td>
                            <td>
                                {game.players[0]?.name}
                            </td>
                            <td>
                                {game.players[0]?.deck}
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                {game.players[1]?.name}
                            </td>
                            <td>
                                {game.players[1]?.deck}
                            </td>
                            <td>
                                {computeWinner(game)}
                            </td>
                            <td>
                                {game.winReason}
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                {game.players[winnerIndex]?.wounds}
                            </td>
                            <td>
                                {game.pairing ? 'Yes' : 'No'}
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <a href={gameApiRoot + game.gameId} download={true}>
                                    {duration.get('hours')}h {duration.get('minutes')}m
                                </a>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
};

export default TaggedGameList;
