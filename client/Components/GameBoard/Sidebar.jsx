import React from 'react';
import CardInspector from './CardInspector';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import TimeLimitClock from './TimeLimitClock';
import Clock from './Clock';
import { useSelector } from 'react-redux';
import CardLog from './CardLog';
import GameMenu from './GameMenu';
import CardLogEx from './CardLogEx';
import ReplayControls from './ReplayControls';
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
    leftMode,
    hideContent
}) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const isReplay = currentGame?.isReplay;
    const manualMode = useSelector((state) => state.lobby.currentGame.manualMode);

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
        <>
            {!leftMode && (
                <div className='timer-log-area'>
                    <CardLog
                        items={currentGame.cardLog}
                        onMouseOut={onMouseOut}
                        onMouseOver={onMouseOver}
                    />
                </div>
            )}
            {leftMode && (
                <CardLogEx
                    items={currentGame.cardLog}
                    onMouseOut={onMouseOut}
                    onMouseOver={onMouseOver}
                />
            )}
        </>
    );

    const panelClass = classNames('prompt-area', 'panel', {
        manual: manualMode
    })
    return (
        <div className={panelClass}>
            {leftMode && (
                <GameMenu
                    onSettingsClick={onSettingsClick}
                    onManualModeClick={onManualModeClick}
                    onManualCommandsClick={onManualCommandsClick}
                />
            )}
            {logArea}
            <div className='inset-pane'>
                {isReplay ?
                    <ReplayControls /> :
                    (hideContent ? null : (<ActivePlayerPrompt
                        promptState={thisPlayer.promptState}
                        onButtonClick={onCommand}
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                        onTimerExpired={onTimerExpired}
                        phase={currentGame.currentPhase}
                    />))}
                {getTimer(thisPlayer)}
            </div>
        </div>
    );
};

export default Sidebar;
