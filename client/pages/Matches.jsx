import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import saveAs from 'file-saver';

import { loadGameReplay, loadUserGames, navigate } from '../redux/actions';

function urlToPromise(url) {
    return new Promise(function (resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const Matches = () => {
    const dispatch = useDispatch();
    const username = useSelector((state) => state.account.user.username);
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
    const computeWinnerIndex = (game) => {
        return game.winner === game.players[0].name ? 0 : 1;
    };

    const downloadFile = (game) => {
        const replayUrl = gameApiRoot + game.gameId + '/replay/';
        var zip = new JSZip();

        zip.file(game.gameId + '.replay', urlToPromise(replayUrl), { binary: true });

        // when everything has been downloaded, we can trigger the dl
        zip.generateAsync(
            {
                type: "blob",
                compression: "DEFLATE"
            },
            function updateCallback(metadata) {
                //respond to progress callback
            }
        ).then(
            function callback(blob) {

                // see FileSaver.js
                saveAs(blob, game.gameId + '.ashteki');

                // showMessage("done !");
            },
            function (e) {
                // showError(e);
            }
        );
        return false;
    }
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
                    <option value='solo'>Solo</option>
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
                            <th>Blood Pts</th>
                            <th>More</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games &&
                            games.map((game) => {
                                const startedAt = moment(game.startedAt);
                                const finishedAt = moment(game.finishedAt);
                                const duration = moment.duration(finishedAt.diff(startedAt));
                                const winnerIndex = game.winner ? computeWinnerIndex(game) : -1;

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
                                            {game.players[winnerIndex]?.wounds}
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            {game.chat && (
                                                <a
                                                    href={gameApiRoot + game.gameId + '/chat'}
                                                    target='blank'
                                                >
                                                    Game Chat
                                                </a>
                                            )}
                                            {game.saveReplay && (
                                                <>
                                                    &nbsp;|&nbsp;
                                                    <a
                                                        href='#'
                                                        onClick={() => {
                                                            dispatch(loadGameReplay(game.gameId));
                                                            dispatch(navigate('/'));
                                                        }}
                                                    >Load replay</a>
                                                    &nbsp;|&nbsp;
                                                    <a
                                                        href='#'
                                                        onClick={() => downloadFile(game)}
                                                    >
                                                        Download replay
                                                    </a>
                                                </>
                                            )}
                                            <br />
                                            {duration.get('hours')}h {duration.get('minutes')}m
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            )
            }
        </div >
    );
};

export default Matches;
