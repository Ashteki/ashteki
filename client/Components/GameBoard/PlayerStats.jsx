import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faWrench,
    faList,
    faCogs,
    faHistory,
    faBolt,
    faStickyNote
} from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons'

import PlayerName from '../Site/PlayerName';
import Minus from '../../assets/img/Minus.png';
import Plus from '../../assets/img/Plus.png';
import FirstPlayerImage from '../../assets/img/firstplayer.png';
import Clock from './Clock';
import './PlayerStats.scss';
import CardPileLink from './CardPileLink';
import { useDispatch, useSelector } from 'react-redux';
import { sendGameMessage } from '../../redux/actions';
import Droppable from './Droppable';
import ConcedeLeave from './ConcedeLeave';
import GameCountMenu from '../Navigation/GameCountMenu';
import SpectatorIcon from './SpectatorIcon';
import ServerStatus from '../Navigation/ServerStatus';

const PlayerStats = ({
    activePlayer,
    actions,
    clockState,
    compactLayout,
    firstPlayer,
    isMe,
    leftMode,
    manualModeEnabled,
    onCardClick,
    onDeckNotesClick,
    onDiceHistoryClick,
    onDragDrop,
    onManualModeClick,
    onManualCommandsClick,
    onMenuItemClick,
    onPopupChange,
    onTouchMove,
    onClockZero,
    onMessagesClick,
    onSettingsClick,
    showControls,
    onMouseOut,
    onMouseOver,
    phoenixborn,
    player,
    round,
    showManualMode,
    showMessages,
    showContextItem,
    side,
    size,
    solo,
    winner
}) => {
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const isReplay = currentGame?.isReplay;
    const user = useSelector((state) => state.account.user);
    const isSpectating = !currentGame?.players[user?.username];
    const { gameConnected, gameConnecting, gameResponse } = useSelector((state) => ({
        gameConnected: state.games.connected,
        gameConnecting: state.games.connecting,
        gameResponse: state.games.responseTime
    }));

    const cardPiles = player.cardPiles;

    const toggleLimited = () => {
        if (showControls) {
            dispatch(sendGameMessage('modifyLimited', player.limitedPlayed));
        }
    }

    const renderActions = () => {
        return (
            <div className='state'>
                {renderMainAction()}
                {renderSideAction()}
                {renderLimited()}
            </div>
        );
    };

    const renderLifeRemaining = () => {
        const pb = phoenixborn;
        let pbDamage = 0;
        let lifeClass = 'life-green';
        let lifeValue = 0;

        if (pb) {
            const pbLife = pb.life;
            pbDamage = phoenixborn.tokens.damage
                ? phoenixborn.tokens.damage
                : 0;
            lifeValue = Math.max(0, pbLife - pbDamage - pb.drowningLevel);
            if (lifeValue <= 10) {
                lifeClass = 'life-orange';
            }
            if (lifeValue <= 5) {
                lifeClass = 'life-red';
            }
        }

        let classes = classNames('action', 'life-remaining', lifeClass);
        return (
            <div className='state'>
                <span key={`life-rem`} className={classes}>
                    <span title='Life remaining'>{lifeValue}</span>
                    {pb.drowningLevel > 0 &&
                        < span className='drowning-indicator' title='Drowning Level'>({pb.drowningLevel})</span>
                    }
                </span>

            </div >
        );
    }

    const renderChimeraPhase = () => {
        return (
            <div className='state'>
                <span key={`chimera-phase`} className='action chimera-phase'>
                    Phase {player.chimeraPhase}
                </span>
            </div>
        );
    };

    const renderLimited = () => {
        const value = !player.limitedPlayed;
        let actionClass = classNames('action', value ? '' : 'exhausted');
        return (
            <a
                href='#'
                key='limitedPlayed'
                className={actionClass}
                onClick={toggleLimited}
                title='reaction'
            >
                <FontAwesomeIcon icon={faBolt} />
            </a>
        );
    }

    const renderMainAction = () => {
        const actionValue = actions['main'];
        let actionClass = classNames('action', actionValue ? '' : 'exhausted');
        let diceFont = `phg-main-action`;
        return (
            <a
                href='#'
                key={`action-main`}
                className={actionClass}
                onClick={() => {
                    if (showControls) {
                        dispatch(sendGameMessage('modifyAction', 'main', actions['main']));
                    }
                }}
                title='main action'
            >
                <span className={diceFont}></span>
            </a>
        );
    }

    const renderSideAction = () => {
        const actionValue = actions['side'];
        let actionClass = classNames('action', actionValue ? '' : 'exhausted');
        let diceFont = `phg-side-action`;
        return (
            <>
                {showControls ? (
                    <a
                        href='#'
                        className='btn-stat'
                        onClick={() => {
                            dispatch(sendGameMessage('changeStat', 'side', -1));
                        }}

                    >
                        <img src={Minus} title='- side' alt='-' />
                    </a>
                ) : null}
                <span key={`action-side`} className={actionClass}>
                    {actionValue}
                    <span className={diceFont} title={`side action`}></span>
                </span>
                {showControls ? (
                    <a
                        href='#'
                        className='btn-stat'
                        onClick={() => {
                            dispatch(sendGameMessage('changeStat', 'side', 1))
                        }}
                    >
                        <img src={Plus} title='+ side' alt='+' />
                    </a>
                ) : null}
            </>
        );
    }

    const renderDroppableList = (source, child) => {
        return isMe ? (
            <Droppable onDragDrop={onDragDrop} source={source} manualMode={manualModeEnabled}>
                {child}
            </Droppable>
        ) : (
            child
        );
    };

    const playerAwol = player.awol ? 'awol' : '';
    let playerDisconnect = player.disconnected && !isReplay && (
        <div className='state'>
            <div className={`disconnected ${playerAwol}`}>Disconnected!</div>
        </div>
    )

    let playerAvatar = (
        <div className='state'>
            <PlayerName player={player} />
        </div>
    );

    let statsClass = classNames('panel player-stats', {
        'active-player': activePlayer
    });

    let firstPlayerToken = firstPlayer ? (
        <div className='state'>
            <img src={FirstPlayerImage} title='First Player' />
        </div>
    ) : (
        ''
    );

    let clock =
        !clockState || clockState.mode === 'off' ? null : (
            <div className='state'>
                <div className='state clock-frame'>
                    <div className='state'>
                        <Clock
                            secondsLeft={clockState.timeLeft}
                            mode={clockState.mode}
                            stateId={clockState.stateId}
                            periods={clockState.periods}
                            mainTime={clockState.mainTime}
                            timePeriod={clockState.timePeriod}
                            winner={winner}
                            onClockZero={onClockZero}
                        />
                    </div>
                </div>
            </div>
        );

    const pileProps = {
        isMe,
        onMenuItemClick,
        onPopupChange,
        onTouchMove,
        manualMode: manualModeEnabled,
        onCardClick,
        onDragDrop,
        onMouseOut,
        onMouseOver,
        popupLocation: side,
        size
    };

    const archives = (
        <CardPileLink
            {...pileProps}
            cards={cardPiles.archives}
            className='archives'
            title='Conjurations'
            source='archives'
        />
    );

    const draw = (
        <CardPileLink
            {...pileProps}
            cards={cardPiles.deck}
            className='draw'
            numDeckCards={player.numDeckCards}
            title='Draw'
            source='deck'
        />
    );

    const hand = (
        <CardPileLink
            {...pileProps}
            cards={cardPiles.hand}
            className='hand-popup'
            title='Hand'
            source='hand'
        />
    );

    return (
        <div className={statsClass}>
            {playerAvatar}
            {solo && !isMe && renderChimeraPhase()}
            {renderLifeRemaining()}
            {renderActions()}
            {firstPlayerToken}
            {clock}
            {activePlayer && <div className='state first-player-state'>Active Player</div>}
            {(compactLayout || solo) && (
                <>
                    <div className='state'>{renderDroppableList('archives', archives)}</div>
                    <div className='state'>{renderDroppableList('draw', draw)}</div>
                    <div className='state'>{renderDroppableList('hand', hand)}</div>
                </>
            )}
            {playerDisconnect}
            {showMessages && (
                <div className='state chat-status'>
                    {player.deckNotes && (
                        <div className='state'>
                            <a href='#' className='pr-1 pl-1' title='Show deck notes'>
                                <FontAwesomeIcon icon={faStickyNote} onClick={onDeckNotesClick} />
                            </a>
                        </div>
                    )}
                    {!isSpectating && (
                        <div className='state'>
                            <a href='#' className='pr-1 pl-1' title='Show dice/card history'>
                                <FontAwesomeIcon
                                    icon={faHistory}
                                    onClick={onDiceHistoryClick}
                                ></FontAwesomeIcon>
                            </a>
                        </div>
                    )}
                    {showContextItem && showManualMode && (
                        <div className='state'>
                            <a
                                href='#'
                                className={manualModeEnabled ? 'text-danger' : ''}
                                onClick={onManualModeClick}
                            >
                                <FontAwesomeIcon icon={faWrench}></FontAwesomeIcon>
                                <span className='ml-1'>Manual Mode</span>
                            </a>
                            &nbsp;
                            <a href='#' className='pr-1 pl-1' title='Show manual command list'>
                                <FontAwesomeIcon icon={faList} onClick={onManualCommandsClick} />
                            </a>
                        </div>
                    )}
                    {showContextItem && (
                        <div className='state'>
                            <a href='#' onClick={onSettingsClick} className='pr-1 pl-1'>
                                <FontAwesomeIcon icon={faCogs}></FontAwesomeIcon>
                                <span className='ml-1'>Settings</span>
                            </a>
                        </div>
                    )}
                    <div className='state'>
                        <a href='#' onClick={onMessagesClick} className='pl-1' title='Toggle chat'>
                            <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                        </a>
                    </div>
                </div>
            )}
            {!showMessages && !leftMode && (
                <>
                    <div className='state chat-status'>
                        <GameCountMenu />
                        {showContextItem && <ConcedeLeave showText={!isSpectating} />}
                        &nbsp;|&nbsp;
                        <ServerStatus
                            connected={gameConnected}
                            connecting={gameConnecting}
                            serverType='Game server'
                            responseTime={gameResponse}
                        />
                        &nbsp;|&nbsp;Round&nbsp;{round}&nbsp;|&nbsp;
                        <SpectatorIcon />
                    </div>
                </>
            )}
            {!showMessages && leftMode && !isReplay && (
                <div className='state chat-status'>
                    <ServerStatus
                        connected={gameConnected}
                        connecting={gameConnecting}
                        serverType='Game server'
                        responseTime={gameResponse}
                    />

                </div>
            )}
            {!showMessages && leftMode && isReplay && <div className='state chat-status'>REPLAY</div>}
        </div>
    );
};

PlayerStats.displayName = 'PlayerStats';

export default PlayerStats;
