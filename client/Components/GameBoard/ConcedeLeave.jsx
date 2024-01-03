import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { sendGameMessage, closeGameSocket } from '../../redux/actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faSkull } from '@fortawesome/free-solid-svg-icons';

const ConcedeLeave = ({ showText }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.account.user);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const isSpectating = !currentGame?.players[user?.username];

    const isGameActive = () => {
        if (!currentGame || !user) {
            return false;
        }

        if (currentGame.winner || currentGame.finishedAt) {
            return false;
        }

        let thisPlayer = currentGame.players[user.username];
        if (!thisPlayer) {
            thisPlayer = Object.values(currentGame.players)[0];
        }

        let otherPlayer = Object.values(currentGame.players).find((player) => {
            return player.name !== thisPlayer.name;
        });

        if (!otherPlayer) {
            return false;
        }

        if (otherPlayer.left) {
            return false;
        }

        return true;
    };

    const onConcedeClick = () => {
        toastr.confirm(t('Are you sure you want to concede this game?'), {
            okText: t('Ok'),
            cancelText: t('Cancel'),
            onOk: () => {
                dispatch(sendGameMessage('concede'));
            }
        });
    };

    const onLeaveClick = () => {
        if (!isSpectating && isGameActive()) {
            toastr.confirm(
                t(
                    'Your game is not finished. If you leave you will concede the game. Are you sure you want to leave?'
                ),
                {
                    okText: t('Ok'),
                    cancelText: t('Cancel'),
                    onOk: () => {
                        // dispatch(sendGameMessage('concede'));
                        dispatch(sendGameMessage('leavegame'));
                        dispatch(closeGameSocket());
                    }
                }
            );

            return;
        }

        dispatch(sendGameMessage('leavegame'));
        dispatch(closeGameSocket());
    };

    if (!currentGame || !currentGame.started) {
        return null;
    }
    return !isSpectating && isGameActive() && !currentGame.solo ? (
        <a
            href='#'
            className='pr-1 pl-1 game-menu-item concede'
            title='Concede'
            onClick={onConcedeClick}
        >
            <FontAwesomeIcon icon={faSkull} className='game-menu-icon' /> {showText && 'Concede'}
        </a>
    ) : (
        <a
            href='#'
            className='pr-1 pl-1 game-menu-item leave'
            title='Leave the game'
            onClick={onLeaveClick}
        >
            <FontAwesomeIcon icon={faRightFromBracket} className='game-menu-icon' style={{ rotate: '180deg' }} /> {showText && 'Leave'}
        </a>
    );
};

export default ConcedeLeave;
