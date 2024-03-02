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
import discordTextLogo from '../../assets/img/discord-logo-white.svg';

import './GameLobby.scss';
import { useEffect } from 'react';
import { startNewGame, joinPasswordGame, sendSocketMessage, setUrl, navigate, getLeaguePairings } from '../../redux/actions';
import { useRef } from 'react';
import PictureButton from '../Lobby/PictureButton';
import LeaguePairings from './LeaguePairings';

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

    const { games, newGame, newGameType, currentGame, passwordGame, pairings } = useSelector((state) => ({
        games: state.lobby.games,
        newGame: state.lobby.newGame,
        newGameType: state.lobby.newGameType,
        currentGame: state.lobby.currentGame,
        passwordGame: state.lobby.passwordGame,
        pairings: state.lobby.leaguePairings
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
            dispatch(setUrl('/'));
        }
    }, [currentGame, dispatch, gameId, games]);

    const handleNewGameClick = (gameType) => {
        if (!user) {
            return;
        }

        if (gameType === 'league') {
            dispatch(getLeaguePairings('PHX'));
        } else {
            dispatch(startNewGame(gameType));
        }
    };

    const newGameText = currentGame?.started === false ? currentGame.name : 'Start a new game';
    return (
        <Row>
            <Col md='6'>
                <div className='lobby-card'>
                    {!user && (
                        <div className='text-center'>
                            <AlertPanel type='warning'>
                                {t('Please log in to be able to start a new game')}
                            </AlertPanel>
                        </div>
                    )}
                    <div className='lobby-header'>{newGameText}</div>
                    {!newGame && !pairings && currentGame?.started !== false && (
                        <>
                            <div className='game-buttons'>
                                <PictureButton
                                    text='2 Player'
                                    imageClass='pvp'
                                    onClick={() => handleNewGameClick('pvp')}
                                />
                                <PictureButton
                                    text='League'
                                    // header='Premium'
                                    imageClass='league'
                                    onClick={() => handleNewGameClick('league')}
                                />
                                <PictureButton
                                    text='Chimera'
                                    // header='Premium'
                                    imageClass='chimera'
                                    onClick={() => handleNewGameClick('chimera')}
                                />
                            </div>
                            <div className='lobby-header'><hr /></div>
                            <div className='game-buttons'>
                                <PictureButton
                                    text='Decks'
                                    imageClass='decks-link'
                                    onClick={() => dispatch(navigate('/decks'))}
                                />
                            </div>
                            <div className='game-buttons'>
                                <PictureButton
                                    text='Results'
                                    imageClass='records-link'
                                    onClick={() => dispatch(navigate('/results'))}
                                />
                            </div>
                        </>

                    )}

                    {newGame && <NewGame />}
                    {currentGame?.started === false && <PendingGame />}
                    {pairings && <LeaguePairings pairings={pairings} />}
                </div>
                <div ref={topRef}>
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

                <div className='lobby-card'>
                    <a
                        className='link-box-item lobby-content'
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://discord.gg/UU5bduq'
                    >
                        <div>
                            <h2 className='lobby-header'>
                                <img src={discordTextLogo} className='textlogo' />
                                Join the Ashes Discord!
                            </h2>
                            <div className='d-none d-sm-block'>
                                <ul className='two-column'>
                                    <li>Find other players</li>
                                    <li>Talk strategy</li>
                                    <li>Get deckbuilding advice</li>
                                    <li>Join a league or tournament</li>
                                    <li>Ask rules questions</li>
                                    <li>Report a bug</li>
                                </ul>
                            </div>
                        </div>
                    </a>
                </div>
            </Col>
        </Row>
    );
};

export default GameLobby;
