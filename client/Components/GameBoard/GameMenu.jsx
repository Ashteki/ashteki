import React, { useState } from 'react';
import ConcedeLeave from './ConcedeLeave';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCogs, faList, faWrench } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import SpectatorIcon from './SpectatorIcon';

const GameMenu = ({ onSettingsClick, onManualModeClick, onManualCommandsClick }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.account.user);
    const isSpectating = !currentGame?.players[user?.username];
    const [showPopup, setShowPopup] = useState(false);

    const manualClassNames = classNames('game-menu-item', {
        'text-danger': currentGame.manualMode
    })

    return (
        <>
            <div className='game-menu-header'>
                <ConcedeLeave />
                {`| Round ${currentGame.round} | `} <SpectatorIcon />
                {' | '}
                <FontAwesomeIcon
                    className=''
                    icon={faCog}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowPopup(!showPopup);
                    }}
                />

            </div>
            {showPopup && (
                <div className='game-menu'
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowPopup(!showPopup);
                    }}
                >
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
            )}
        </>
    );
};

export default GameMenu;
