import React, { useEffect, useState } from 'react';
import PictureButton from '../Lobby/PictureButton';
import { Button, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loadGameReplay, loadReplays, navigate, startGameReplay } from '../../redux/actions';
import * as JSZip from 'jszip';
import { _ } from 'core-js';
import moment from 'moment';

const LoadReplay = ({ onCancel }) => {
    const dispatch = useDispatch();
    const recentGames = useSelector((state) => state.games.replays);
    const [replayData, setReplayData] = useState();

    const onFileChange = (event) => {
        // Update the state
        var file = event.target.files[0];
        var zip = new JSZip();
        zip.loadAsync(file) // read the blob
            .then(
                (zip) => {
                    Object.values(zip.files)[0]
                        .async('string')
                        .then((fileData) => {
                            const jsonReplay = JSON.parse(fileData);
                            if (jsonReplay.success) {
                                setReplayData(jsonReplay.replay);
                            }
                        });
                },
                () => {
                    alert('Not a valid zip file');
                }
            );
    };

    // On file upload (click the upload button)
    const onFileUpload = () => {
        if (replayData) {
            dispatch(startGameReplay(replayData));
        }
    };

    const onReplayClick = (gameId) => {
        dispatch(loadGameReplay(gameId));
        navigate('/');
    };

    useEffect(() => {
        dispatch(loadReplays());
    }, [dispatch]);

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

    return (
        <div className='replays'>
            <div className='newgame-header'>
                <PictureButton
                    text='Replay'
                    // header='Premium'
                    disabled={true}
                    imageClass='replay'
                />

                <Col>
                    <p>Upload a replay file or choose one of your recent games</p>
                    <Form.Control
                        type='file'
                        label='Upload a replay file'
                        size='lg'
                        className=''
                        onChange={onFileChange}
                    />

                    <div className='newgame-buttons'>
                        <Button
                            variant='primary'
                            className='def'
                            onClick={() => onCancel && onCancel()}
                        >
                            Cancel
                        </Button>
                        <button className='btn btn-secondary def' onClick={onFileUpload}>
                            Start
                        </button>
                    </div>
                </Col>
            </div>
            <div className='lobby-header'>Recent Games</div>
            {recentGames?.length > 0 && (
                <>
                    <table className='table table-striped table-dark'>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>My Deck</th>
                                <th>Opponent</th>
                                <th>Winner</th>
                                <th>Ranked</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentGames.map((game) => {
                                let soloLevel = '';
                                if (game.solo && game.players[1]?.level) {
                                    soloLevel = ' (' + game.players[1]?.level + game.players[1]?.stage + ')';
                                }

                                return (
                                    <tr key={game.gameId}>
                                        <td>{moment(game.startedAt).format('MMM-DD HH:mm')}<br />
                                            <b>{game.label}</b></td>
                                        <td>{game.players[0].deck}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            {game.players[1]?.name} {soloLevel}
                                            <br />
                                            {game.players[1]?.deck}
                                        </td>
                                        <td>
                                            {computeWinner(game)}
                                            <br />({game.winReason})
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            {game.gameType === 'competitive' ? 'Yes' : 'No'}
                                        </td>
                                        <td>
                                            <button
                                                className='btn btn-sm btn-success def'
                                                onClick={(e) => {
                                                    e.target.disabled = true;
                                                    e.target.innerText = 'Loading...';
                                                    onReplayClick(game.gameId);
                                                }}
                                            >
                                                Load
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}
            {!recentGames || recentGames.length === 0 ? (
                <div>You have no recorded games.</div>
            ) : null}
        </div>
    );
}

export default LoadReplay;
