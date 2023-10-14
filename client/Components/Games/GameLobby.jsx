import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';

import NewGame from './NewGame';
import GameList from './GameList';
import PendingGame from './PendingGame';
import PasswordGame from './PasswordGame';
import AlertPanel from '../Site/AlertPanel';

import './GameLobby.scss';
import { useEffect } from 'react';
import { startNewGame, joinPasswordGame, sendSocketMessage, setUrl } from '../../redux/actions';
import { useRef } from 'react';
import PictureButton from '../Lobby/PictureButton';

const GameLobby = ({ gameId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const filters = [
        { name: 'casual', label: t('Casual') },
        { name: 'competitive', label: t('Ranked') }
    ];
    const filterDefaults = {};

    for (const filter of filters) {
        filterDefaults[filter.name] = true;
    }

    const { games, newGame, newGameType, currentGame, passwordGame } = useSelector((state) => ({
        games: state.lobby.games,
        newGame: state.lobby.newGame,
        newGameType: state.lobby.newGameType,
        currentGame: state.lobby.currentGame,
        passwordGame: state.lobby.passwordGame
    }));
    const user = useSelector((state) => state.account.user);
    const [currentFilter, setCurrentFilter] = useState(filterDefaults);
    const topRef = useRef(null);

    useEffect(() => {
        if ('Notification' in window) {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission(() => { });
            }
        }

        let filter = localStorage.getItem('gameFilter');
        if (filter) {
            setCurrentFilter(JSON.parse(filter));
        }
    }, []);

    useEffect(() => {
        if (!currentGame && gameId && games.length > 0) {
            const game = games.find((x) => x.id === gameId);

            if (!game) {
                toastr.error('Error', 'The game you tried to join was not found.');
            } else {
                if (!game.started && Object.keys(game.players).length < 2) {
                    if (game.needsPassword) {
                        dispatch(joinPasswordGame(game, 'Join'));
                    } else {
                        dispatch(sendSocketMessage('joingame', gameId));
                    }
                } else {
                    if (game.needsPassword) {
                        dispatch(joinPasswordGame(game, 'Watch'));
                    } else {
                        dispatch(sendSocketMessage('watchgame', game.id));
                    }
                }
            }
            dispatch(setUrl('/play'));
        }
    }, [currentGame, dispatch, gameId, games]);

    const handleNewGameClick = (gameType) => {
        if (user) {
            dispatch(startNewGame(gameType));
        }
    };

    return (
        <>
            <Row>
                <Col md='6' >
                    <div className='lobby-card'>
                        {!user && (
                            <div className='text-center'>
                                <AlertPanel type='warning'>
                                    {t('Please log in to be able to start a new game')}
                                </AlertPanel>
                            </div>
                        )}
                        <div className='lobby-header'>Start a new game vs:</div>
                        {!newGame && (
                            <>
                                <div className='game-buttons'>
                                    <div className='new-game-buttons'>
                                        <PictureButton
                                            text='Player'
                                            imageClass='pvp'
                                            onClick={() => handleNewGameClick('pvp')}
                                        />
                                        <PictureButton
                                            text='Chimera'
                                            header='Premium'
                                            imageClass='chimera'
                                            onClick={() => handleNewGameClick('chimera')}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {newGame && <NewGame />}
                    </div>
                    <div ref={topRef}>
                        {currentGame?.started === false && <PendingGame />}
                        {passwordGame && <PasswordGame />}
                    </div>
                </Col>
                <Col md='6'>
                    <div className='lobby-card'>

                        <div className='lobby-header'>Game List</div>

                        <div className='game-list'>
                            {games.length === 0 ? (
                                <div className='no-games-notice'>
                                    No games are currently in progress
                                </div>
                            ) : (
                                <GameList
                                    games={games}
                                    gameFilter={currentFilter}
                                    onJoinOrWatchClick={() => topRef.current.scrollIntoView(false)}
                                />
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default GameLobby;
