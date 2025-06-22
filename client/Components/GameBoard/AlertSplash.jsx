import React from 'react';
import Panel from '../Site/Panel';

import './WinLoseSplash.scss';
import { useSelector } from 'react-redux';
import SplashPlayerPrompt from './SplashPlayerPrompt';

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
        <Panel cardClass={`alert-splash`} onCloseClick={onCloseClick}>
            <SplashPlayerPrompt
                promptState={thisPlayer.promptState}
                onButtonClick={onCommand}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onTimerExpired={onTimerExpired}
            />
        </Panel >
    );
};

export default AlertSplash;
