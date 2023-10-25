import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { getFormatLabel } from '../../util';
import TimeLimitIcon from '../../assets/img/Timelimit.png';
import ShowHandIcon from '../../assets/img/ShowHandIcon.png';
import OpenHandsIcon from '../../assets/img/OpenHandsIcon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faLock, faChessKnight } from '@fortawesome/free-solid-svg-icons';
import { toastr } from 'react-redux-toastr';
import PlayerName from '../Site/PlayerName';
import ZoomableCard from '../Decks/ZoomableCard';
import { useDispatch, useSelector } from 'react-redux';
import { joinPasswordGame } from '../../redux/actions';

const GameListItem = ({ game, onJoinOrWatchClick }) => {
    const dispatch = useDispatch();
    const lobbySocket = useSelector((state) => state.lobby.socket);
    const user = useSelector((state) => state.account.user);
    const currentGame = useSelector((state) => state.lobby.currentGame);

    const joinGame = (event, game) => {
        event.preventDefault();

        if (!user) {
            toastr.error('Error', 'Please login before trying to join a game');
            return;
        }

        if (game.needsPassword) {
            dispatch(joinPasswordGame(game, 'Join'));
        } else {
            lobbySocket.emit('joingame', game.id);
        }

        if (onJoinOrWatchClick) {
            onJoinOrWatchClick();
        }
    }

    const watchGame = (event, game) => {
        event.preventDefault();

        if (!user) {
            toastr.error('Error', 'Please login before trying to watch a game');
            return;
        }

        if (game.needsPassword) {
            dispatch(joinPasswordGame(game, 'Watch'));
        } else {
            lobbySocket.emit('watchgame', game.id);
        }

        if (onJoinOrWatchClick) {
            onJoinOrWatchClick();
        }
    }

    const removeGame = (event, game) => {
        event.preventDefault();

        toastr.confirm('Are you sure you want to kill this game?', {
            okText: 'Ok',
            cancelText: 'Cancel',
            onOk: () => {
                lobbySocket.emit('removegame', game.id);
            }
        });
    }

    const canJoin = (game) => {
        if (currentGame || game.started || game.full || game.solo) {
            return false;
        }

        return true;
    }

    const getPlayerNameAndAvatar = (player, firstPlayer) => {
        let userStyle = {};
        if (player.faveColor) {
            userStyle.color = player.faveColor;
        }

        return (
            <div className='game-player-name'>
                <PlayerName player={player} />
            </div>
        );
    }

    const canWatch = (game) => {
        return (
            !currentGame &&
            (game.allowSpectators || user?.permissions?.canManageGames) &&
            !(game.started && Object.keys(game.players).length < 2)
        );
    }

    const getPlayerCard = (player, firstPlayer, gameStarted, showPhoenixborn) => {
        const showPics = gameStarted && showPhoenixborn && player.deck;
        // const pbCard =
        //     gameStarted && showPhoenixborn && player.deck ? (
        //         <div className='game-list-deck-image'>
        //             <ZoomableCard card={{ imageStub: player.deck.pbStub }} />
        //         </div>
        //     ) : null;
        if (firstPlayer) {
            return (
                <div className='game-faction-row first-player'>
                    {/* {pbCard} */}
                    {showPics && <div className={`decklist-entry-image ${player.deck.stub}`}></div>}
                    {getPlayerNameAndAvatar(player, firstPlayer)}
                </div>
            );
        }

        return (
            <div className='game-faction-row other-player'>
                {getPlayerNameAndAvatar(player, firstPlayer)}
                {showPics && <div className={`decklist-entry-image ${player.deck.stub}`}></div>}

                {/* {pbCard} */}
            </div>
        );
    }

    const getPlayers = (game) => {
        let firstPlayer = true;
        let players = Object.values(game.players).map((player) => {
            let classes = classNames('game-player-row', {
                'first-player': firstPlayer,
                'other-player': !firstPlayer
            });

            let retPlayer = (
                <div key={player.name} className={classes}>
                    <div>{getPlayerCard(player, firstPlayer, game.started, game.allowSpectators)}</div>
                </div>
            );

            firstPlayer = false;

            return retPlayer;
        });

        if (players.length === 1) {
            if (canJoin(game)) {
                players.push(
                    <div key={players[0].name} className={'game-player-row other-player'}>
                        <div className='game-faction-row other-player'>
                            <button
                                className='btn btn-success gamelist-button img-fluid def'
                                onClick={(event) => joinGame(event, game)}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                );
            } else {
                players.push(
                    <div key={players[0].name} className='game-faction-row other-player' />
                );
            }
        }

        return players;
    }


    let players = getPlayers(game);

    let isAdmin = user && user.permissions.canManageGames;
    let rowClass = classNames('game-row', {
        [game.node]: game.node && isAdmin,
        ['private-game']: game.gamePrivate && isAdmin
    });

    const startTime = game.startedAt ? game.startedAt : game.createdAt;
    const timeAdvice = game.started ? 'Started' : 'Created';
    let timeDifference = moment().diff(moment(startTime));
    if (timeDifference < 0) {
        timeDifference = 0;
    }

    let formattedTime = moment.utc(timeDifference).format('HH:mm');
    const formatBadgeClass = classNames('game-format', game.gameFormat);

    return (
        <div key={game.id}>
            <hr />
            <div className={rowClass}>
                <div className='game-header-row'>
                    <span className={formatBadgeClass}>
                        {getFormatLabel(game.gameFormat)}
                    </span>
                    <span className='game-title'>
                        <b>{game.name}</b>
                    </span>{' '}
                    <span className='game-time'>{`[${timeAdvice}: ${formattedTime}]`}</span>
                    <span className='game-icons'>
                        {game.showHand && (
                            <img
                                src={ShowHandIcon}
                                className='game-list-icon-white'
                                alt={t('Show hands to spectators')}
                                title={t('Show hands to spectators')}
                            />
                        )}
                        {game.openHands && (
                            <img
                                src={OpenHandsIcon}
                                className='game-list-icon-white'
                                title={'Play with open hands'}
                            />
                        )}
                        {game.needsPassword && <FontAwesomeIcon icon={faLock} title='Password required' />}
                        {game.useGameTimeLimit && (
                            <img
                                src={TimeLimitIcon}
                                className='game-list-icon'
                                alt={t('Time limit used')}
                                title={t('Time limit used')}
                            />
                        )}
                        {game.clockType === 'chess' && (
                            <FontAwesomeIcon icon={faChessKnight} title='Chess Clock' />
                        )}
                        {!game.allowSpectators && (
                            <FontAwesomeIcon icon={faEyeSlash} title='No spectators' />
                        )}
                    </span>
                </div>
                <div className='game-middle-row'>{players}</div>
                <div className='game-row-buttons'>
                    {canWatch(game) && (
                        <button
                            className='btn btn-primary gamelist-button def'
                            onClick={(event) => watchGame(event, game)}
                        >
                            Watch
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            className='btn btn-danger gamelist-button def'
                            onClick={(event) => removeGame(event, game)}
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GameListItem;
