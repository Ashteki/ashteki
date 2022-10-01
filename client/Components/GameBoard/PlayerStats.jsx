import React from 'react';
import { withTranslation, Trans } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEye,
    faEyeSlash,
    faCopy,
    faWrench,
    faList,
    faCogs,
    faComment,
    faHistory
} from '@fortawesome/free-solid-svg-icons';
import { Badge } from 'react-bootstrap';

import PlayerName from '../Site/PlayerName';
import Minus from '../../assets/img/Minus.png';
import Plus from '../../assets/img/Plus.png';
import FirstPlayerImage from '../../assets/img/firstplayer.png';

import './PlayerStats.scss';

export class PlayerStats extends React.Component {
    constructor(props) {
        super(props);

        this.sendUpdate = this.sendUpdate.bind(this);
        this.toggleAction = this.toggleAction.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1);
    }

    toggleAction(actionType) {
        if (this.props.showControls) {
            this.props.sendGameMessage('modifyAction', actionType, this.props.actions[actionType]);
        }
    }

    onSettingsClick(event) {
        event.preventDefault();

        if (this.props.onSettingsClick) {
            this.props.onSettingsClick();
        }
    }

    writeChatToClipboard(event) {
        event.preventDefault();
        let messagePanel = document.getElementsByClassName('messages panel')[0];
        if (messagePanel) {
            navigator.clipboard
                .writeText(messagePanel.innerText)
                .then(() => toastr.success('Copied game chat to clipboard'))
                .catch((err) => toastr.error(`Could not copy game chat: ${err}`));
        }
    }

    renderActions() {
        let actionTypes = ['main', 'side'];
        // let actionOutput =  + this.renderSideAction();

        return (
            <div className='state'>
                {this.renderMainAction()}
                {this.renderSideAction()}
            </div>
        )
    }

    renderLifeRemaining() {
        const pb = this.props.phoenixborn;
        let pbDamage = 0;
        let lifeClass = 'life-green';
        let lifeValue = 0;

        if (pb) {
            const pbLife = pb.life;
            pbDamage = this.props.phoenixborn.tokens.damage
                ? this.props.phoenixborn.tokens.damage
                : 0;
            lifeValue = Math.max(0, pbLife - pbDamage);
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
                <span key={`action-side`} className={classes}>
                    {lifeValue}
                </span>
            </div>
        );
    }

    renderMainAction() {
        const actionValue = this.props.actions['main'];
        let actionClass = classNames('action', actionValue ? '' : 'exhausted');
        let diceFont = `phg-main-action`;
        return (
            <a
                href='#'
                key={`action-main`}
                className={actionClass}
                onClick={this.toggleAction.bind(this, 'main')}
                title='main action'
            >
                <span className={diceFont}></span>
            </a>
        );
    }

    renderSideAction() {
        const actionValue = this.props.actions['side'];
        let actionClass = classNames('action', actionValue ? '' : 'exhausted');
        let diceFont = `phg-side-action`;
        return (
            <div className='state'>
                {this.props.showControls ? (
                    <a
                        href='#'
                        className='btn-stat'
                        onClick={this.sendUpdate.bind(this, 'side', 'down')}
                    >
                        <img src={Minus} title='- side' alt='-' />
                    </a>
                ) : null}
                <span key={`action-side`} className={actionClass}>
                    {actionValue}
                    <span className={diceFont} title={`side action`}></span>
                </span>
                {this.props.showControls ? (
                    <a
                        href='#'
                        className='btn-stat'
                        onClick={this.sendUpdate.bind(this, 'side', 'up')}
                    >
                        <img src={Plus} title='+ side' alt='+' />
                    </a>
                ) : null}
            </div>
        );
    }

    render() {
        let playerAvatar = (
            <div className='state'>
                <PlayerName player={this.props.player} />
            </div>
        );

        let statsClass = classNames('panel player-stats', {
            'active-player': this.props.activePlayer
        });

        let firstPlayerToken = this.props.firstPlayer ? (
            <div className='state'>
                <img src={FirstPlayerImage} title='First Player' />
            </div>
        ) : (
            ''
        );

        return (
            <div className={statsClass}>
                {playerAvatar}
                {this.renderLifeRemaining()}
                {this.renderActions()}
                {firstPlayerToken}
                {this.props.activePlayer && (
                    <div className='state first-player-state'>
                        <Trans>Active Player</Trans>
                    </div>
                )}

                {this.props.showMessages && (
                    <div className='state chat-status'>
                        <div className='state'>
                            <a href='#' className='pr-1 pl-1' title='Show dice/card history'>
                                <FontAwesomeIcon
                                    icon={faHistory}
                                    onClick={this.props.onDiceHistoryClick}
                                ></FontAwesomeIcon>
                            </a>
                        </div>
                        <div className='state'>
                            <a href='#' className='pr-1 pl-1' title='Mute spectators'>
                                <FontAwesomeIcon
                                    icon={this.props.muteSpectators ? faEyeSlash : faEye}
                                    onClick={this.props.onMuteClick}
                                ></FontAwesomeIcon>
                            </a>
                        </div>
                        {this.props.showManualMode && (
                            <div className='state'>
                                <a
                                    href='#'
                                    className={this.props.manualModeEnabled ? 'text-danger' : ''}
                                    onClick={this.props.onManualModeClick}
                                >
                                    <FontAwesomeIcon icon={faWrench}></FontAwesomeIcon>
                                    <span className='ml-1'>
                                        <Trans>Manual Mode</Trans>
                                    </span>
                                </a>&nbsp;
                                <a href='#' className='pr-1 pl-1' title='Show manual command list'>
                                    <FontAwesomeIcon
                                        icon={faList}
                                        onClick={this.props.onManualCommandsClick}
                                    />
                                </a>
                            </div>
                        )}
                        <div className='state'>
                            <a
                                href='#'
                                onClick={this.onSettingsClick.bind(this)}
                                className='pr-1 pl-1'
                            >
                                <FontAwesomeIcon icon={faCogs}></FontAwesomeIcon>
                                <span className='ml-1'>
                                    <Trans>Settings</Trans>
                                </span>
                            </a>
                        </div>
                        <div className='state'>
                            <a href='#' className='pr-1 pl-1' title='Copy chat to clipboard'>
                                <FontAwesomeIcon
                                    icon={faCopy}
                                    onClick={this.writeChatToClipboard.bind(this)}
                                ></FontAwesomeIcon>
                            </a>
                        </div>
                        <div>
                            <a
                                href='#'
                                onClick={this.props.onMessagesClick}
                                className='pl-1'
                                title='Toggle chat'
                            >
                                <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                                {this.props.numMessages > 0 && (
                                    <Badge variant='danger'>{this.props.numMessages}</Badge>
                                )}
                            </a>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

PlayerStats.displayName = 'PlayerStats';
PlayerStats.propTypes = {
    activePlayer: PropTypes.bool,
    i18n: PropTypes.object,
    manualModeEnabled: PropTypes.bool,
    matchRecord: PropTypes.object,
    muteSpectators: PropTypes.bool,
    numMessages: PropTypes.number,
    onManualModeClick: PropTypes.func,
    onMessagesClick: PropTypes.func,
    onMuteClick: PropTypes.func,
    onSettingsClick: PropTypes.func,
    playerName: PropTypes.string,
    sendGameMessage: PropTypes.func,
    keys: PropTypes.object,
    showControls: PropTypes.bool,
    showManualMode: PropTypes.bool,
    showMessages: PropTypes.bool,
    stats: PropTypes.object,
    t: PropTypes.func,
    player: PropTypes.object,
    actions: PropTypes.object,
    firstPlayer: PropTypes.bool,
    diceHistory: PropTypes.array,
    onDiceHistoryClick: PropTypes.func,
    onManualCommandsClick: PropTypes.func,
    phoenixborn: PropTypes.object
};

export default withTranslation()(PlayerStats);
