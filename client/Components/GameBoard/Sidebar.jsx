import React from 'react';
import CardInspector from './CardInspector';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import TimeLimitClock from './TimeLimitClock';
import Clock from './Clock';
import { useSelector } from 'react-redux';
import CardLog from './CardLog';
import PSGameContextMenu from './PSGameContextMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faList, faWrench } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

const Sidebar = ({
    thisPlayer,
    onCommand,
    onMouseOver,
    onMouseOut,
    onTimerExpired,
    onClockZero,
    onSettingsClick,
    onManualModeClick,
    onManualCommandsClick,
    leftMode
}) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);

    const getTimer = (player) => {
        let clocks = [];
        if (currentGame.useGameTimeLimit) {
            if (currentGame.gameTimeLimit && currentGame.gameTimeLimitStarted) {
                clocks.push(
                    <TimeLimitClock
                        timeLimitStarted={currentGame.gameTimeLimitStarted}
                        timeLimitStartedAt={currentGame.gameTimeLimitStartedAt}
                        timeLimit={currentGame.gameTimeLimit}
                    />
                );
            }
            if (player.clock) {
                clocks.push(
                    <Clock
                        secondsLeft={player.clock.timeLeft}
                        mode={player.clock.mode}
                        stateId={player.clock.stateId}
                        periods={player.clock.periods}
                        mainTime={player.clock.mainTime}
                        timePeriod={player.clock.timePeriod}
                        winner={currentGame.winner}
                        onClockZero={onClockZero}
                    />
                );
            }
        }
        return <div className='time-limit-clock card bg-dark border-primary'>{clocks}</div>;
    };

    const logArea = thisPlayer.inspectionCard ? (
        <CardInspector card={thisPlayer.inspectionCard} />
    ) : (
        <div>
            <div className='timer-log-area'>
                <CardLog
                    items={currentGame.cardLog}
                    onMouseOut={onMouseOut}
                    onMouseOver={onMouseOver}
                />
            </div>
        </div>
    );

    const manualClassNames = classNames('game-menu-item', {
        'text-danger': currentGame.manualMode
    })
    return (
        <div className='prompt-area panel'>
            {leftMode && (
                <div className='game-menu'>
                    <div className='round-display game-menu-item'>{`Round ${currentGame.round}`}</div>
                    <PSGameContextMenu />
                    <a
                        href='#'
                        onClick={onSettingsClick}
                        className='pr-1 pl-1 game-menu-item'
                        title='Settings'
                    >
                        <FontAwesomeIcon icon={faCogs} className='game-menu-icon' />
                    </a>
                    <a
                        href='#'
                        className={manualClassNames}
                        onClick={onManualModeClick}
                        title='Manual Mode'
                    >
                        <FontAwesomeIcon icon={faWrench} className='game-menu-icon' />
                    </a>
                    <a
                        href='#'
                        className='pr-1 pl-1 game-menu-item'
                        title='Show manual command list'
                        onClick={onManualCommandsClick}
                    >
                        <FontAwesomeIcon icon={faList} className='game-menu-icon' />
                    </a>
                </div>
            )}
            {logArea}
            <div className='inset-pane'>
                <ActivePlayerPrompt
                    promptState={thisPlayer.promptState}
                    onButtonClick={onCommand}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    onTimerExpired={onTimerExpired}
                    phase={currentGame.currentPhase}
                />
                {getTimer(thisPlayer)}
            </div>
        </div>
    );
};

export default Sidebar;
