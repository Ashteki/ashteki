import React from 'react';
import PSGameContextMenu from './PSGameContextMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faList, faWrench } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import SpectatorIcon from './SpectatorIcon';

const GameMenu = ({ onSettingsClick, onManualModeClick, onManualCommandsClick }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.account.user);
    const isSpectating = !currentGame?.players[user?.username];

    const manualClassNames = classNames('game-menu-item', {
        'text-danger': currentGame.manualMode
    })

    return (
        <div className='game-menu'>
            <div className='game-menu-header'>
                {`Round ${currentGame.round} | `} <SpectatorIcon />
            </div>
            <PSGameContextMenu />
            <a
                href='#'
                onClick={onSettingsClick}
                className='pr-1 pl-1 game-menu-item'
                title='Settings'
            >
                <FontAwesomeIcon icon={faCogs} className='game-menu-icon' />
            </a>
            {!isSpectating && (
                <>
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
                </>
            )}
        </div>
    );
};

export default GameMenu;
