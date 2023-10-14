import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Trans, useTranslation } from 'react-i18next';
import { Col, Row, Button, Form } from 'react-bootstrap';

import NewGame from './NewGame';
import GameList from './GameList';
import PendingGame from './PendingGame';
import PasswordGame from './PasswordGame';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';

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

    const onFilterChecked = (name, checked) => {
        currentFilter[name] = checked;
        setCurrentFilter(Object.assign({}, currentFilter));

        localStorage.setItem('gameFilter', JSON.stringify(currentFilter));
    };

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
                    <Panel title={t('Current Games')}>
                        {!user && (
                            <div className='text-center'>
                                <AlertPanel type='warning'>
                                    {t('Please log in to be able to start a new game')}
                                </AlertPanel>
                            </div>
                        )}
                        <div className='lobby-header'>Start a new game vs:</div>
                        <div className='game-buttons'>
                            <div className='new-game-buttons'>
                                <PictureButton
                                    backgroundImage='https://cdn.ashes.live/images/cards/clashing-tempers.jpg'
                                    onClick={() => handleNewGameClick('pvp')}
                                    text='Player'
                                    position='center'
                                />
                                <PictureButton
                                    backgroundImage='https://cdn.ashes.live/images/cards/corpse-of-viros-1p-standard-1.jpg'
                                    onClick={() => handleNewGameClick('chimera')}
                                    text='Chimera'
                                    position='50% 40%'
                                    scale='120%'
                                    header='Premium'
                                />
                            </div>
                        </div>
                        <Row>
                            <Col xs='12' className='text-center'>
                                {games.length === 0 ? (
                                    <AlertPanel type='info'>
                                        {t(
                                            'No games are currently in progress. Click the button above to start one.'
                                        )}
                                    </AlertPanel>
                                ) : (
                                    <GameList
                                        games={games}
                                        gameFilter={currentFilter}
                                        onJoinOrWatchClick={() => topRef.current.scrollIntoView(false)}
                                    />
                                )}
                            </Col>
                        </Row>
                    </Panel>
                </Col>
                <Col md='6'>
                    <div ref={topRef}>
                        {newGame && <NewGame />}
                        {currentGame?.started === false && <PendingGame />}
                        {passwordGame && <PasswordGame />}
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default GameLobby;
