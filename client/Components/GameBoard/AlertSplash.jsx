import React from 'react';
import Panel from '../Site/Panel';

import './WinLoseSplash.scss';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import { useSelector } from 'react-redux';

const AlertSplash = ({
    onCloseClick,
    thisPlayer,
    onCommand,
    onMouseOver,
    onMouseOut,
    onTimerExpired
}) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);

    return (
        <Panel cardClass={`splash`} onCloseClick={onCloseClick}>
            <ActivePlayerPrompt
                promptState={thisPlayer.promptState}
                onButtonClick={onCommand}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onTimerExpired={onTimerExpired}
                phase={currentGame.currentPhase}
            />
        </Panel >
    );
};

export default AlertSplash;
