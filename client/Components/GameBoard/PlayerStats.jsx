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
    faCogs,
    faComment
} from '@fortawesome/free-solid-svg-icons';
import { Badge } from 'react-bootstrap';

import Avatar from '../Site/Avatar';
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

    getStatValueOrDefault(stat) {
        if (!this.props.stats) {
            return 0;
        }

        return this.props.stats[stat] || 0;
    }

    toggleAction(actionType) {
        if (this.props.showControls) {
            this.props.sendGameMessage('modifyAction', actionType, this.props.actions[actionType]);
        }
    }

    getButton(stat, name, statToSet = stat) {
        return (
            <div className='state' title={name}>
                {this.props.showControls ? (
                    <a
                        href='#'
                        className='btn-stat'
                        onClick={this.sendUpdate.bind(this, statToSet, 'down')}
                    >
                        <img src={Minus} title='-' alt='-' />
                    </a>
                ) : null}
                <div className={`stat-image ${stat}`}>
                    <div className='stat-value'>{this.getStatValueOrDefault(stat)}</div>
                </div>
                {this.props.showControls ? (
                    <a
                        href='#'
                        className='btn-stat'
                        onClick={this.sendUpdate.bind(this, statToSet, 'up')}
                    >
                        <img src={Plus} title='+' alt='+' />
                    </a>
                ) : null}
            </div>
        );
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

    renderMainAction() {
        const actionValue = this.props.actions['main'];
        let actionClass = classNames('action', actionValue ? '' : 'exhausted');
        let diceFont = `phg-main-action`;
        return (
            <div>
                <span
                    key={`action-main`}
                    className={actionClass}
                    onClick={this.toggleAction.bind(this, 'main')}
                >
                    <span className={diceFont} title={`main action`}></span>
                </span>
            </div>
        );
    }

    renderSideAction() {
        const actionValue = this.props.actions['side'];
        let actionClass = classNames('action', actionValue ? '' : 'exhausted');
        let diceFont = `phg-side-action`;
        return (
            <div>
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
        let t = this.props.t;
        let userStyle = {};
        if (this.props.user?.faveColor) {
            userStyle.color = this.props.user.faveColor;
        }
        let userClass = 'username' + (this.props.user.role ? ` ${this.props.user.role.toLowerCase()}-role` : '');

        let playerAvatar = (
            <div className='state'>
                <Avatar imgPath={this.props.user?.avatar} />
                <b className={userClass} style={userStyle}>{this.props.user?.username || t('Noone')}</b>
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
                            <a href='#' onClick={this.props.onDiceHistoryClick} className='pl-1'>
                                <span className='phg-basic-magic die' title='Dice history'>
                                    {' '}
                                </span>
                            </a>
                        </div>
                        <div className='state'>
                            <a href='#' className='pr-1 pl-1'>
                                <FontAwesomeIcon
                                    icon={this.props.muteSpectators ? faEyeSlash : faEye}
                                    onClick={this.props.onMuteClick}
                                ></FontAwesomeIcon>
                            </a>
                        </div>
                        <div className='state'>
                            <a href='#' className='pr-1 pl-1'>
                                <FontAwesomeIcon
                                    icon={faCopy}
                                    onClick={this.writeChatToClipboard.bind(this)}
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
                        <div>
                            <a href='#' onClick={this.props.onMessagesClick} className='pl-1'>
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
    user: PropTypes.object,
    actions: PropTypes.object,
    firstPlayer: PropTypes.bool,
    diceHistory: PropTypes.array,
    onDiceHistoryClick: PropTypes.func
};

export default withTranslation()(PlayerStats);
