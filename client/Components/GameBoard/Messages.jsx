import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import Avatar from '../Site/Avatar';
import AlertPanel from '../Site/AlertPanel';

import './Messages.scss';

const Messages = ({ messages, onCardMouseOver, onCardMouseOut }) => {
    const owner = useSelector(
        (state) => state.lobby.currentGame.players[state.lobby.currentGame.owner]
    );
    const users = useSelector((state) => state.lobby.users);

    const getUserDetails = (name) => {
        return users.find((u) => u.username === name);
    };

    const formatPlayerChatMsg = (fragment) => {
        const user = getUserDetails(fragment.name);
        const avatar = user && <Avatar imgPath={user.avatar} float />;
        return (
            <div className='message-chat'>
                {avatar}
                {formatplayerNameFragment(fragment)}
            </div>
        );
    }

    const formatplayerNameFragment = (fragment) => {
        const user = getUserDetails(fragment.name);
        if (!user) {
            return fragment.name; // plain player name
        }
        let userClass = 'username' + (user.role ? ` ${user.role.toLowerCase()}-role` : '');
        let userStyle = {};
        if (user.faveColor) {
            userStyle.color = user.faveColor;
        }
        return (
            <span className={userClass} style={userStyle}>
                {user.name}
            </span>
        );
    };

    const getActionFragment = (fragment) => {
        const result = [];
        if (fragment.main) {
            result.push(
                <span className='phg-main-action chat-action' title='main action'></span>
            );
        }
        if (fragment.side) {
            result.push(
                <span className='phg-side-action chat-action' title='side action'></span>
            );
        }

        return result;
    }

    const getBehaviourFragment = (fragment) => {
        const result = [];
        if (fragment.data.text.side) {
            result.push(
                <div><span className='phg-side-action chat-action' title='side action'></span>:{fragment.data.text.side}</div>
            );
        }
        if (fragment.data.text.main) {
            result.push(
                <div><span className='phg-main-action chat-action' title='main action'></span>:{fragment.data.text.main}</div>
            );
        }

        if (fragment.data.text.mainFirst) {
            result.reverse();
        }

        return result;
    }

    const formatMessageText = (message, index) => {
        let messages = [];

        for (const [key, fragment] of Object.entries(message)) {
            if (fragment === null || fragment === undefined) {
                messages.push('');

                continue;
            }

            if (key === 'alert') {
                let message = formatMessageText(fragment.message, index);

                switch (fragment.type) {
                    case 'endofround':
                    case 'phasestart':
                        messages.push(
                            <div
                                className={'fw-bold text-white separator ' + fragment.type}
                                key={'m-' + index}>
                                <hr className={'mt-2 mb-2' + fragment.type} />
                                {message}
                            </div>
                        );
                        break;
                    case 'startofround':
                        messages.push(
                            <div
                                className={'font-weight-bold text-white separator ' + fragment.type}
                                key={'m-' + index}
                            >
                                {message}
                            </div>
                        );
                        break;
                    case 'success':
                        messages.push(
                            <AlertPanel type='success' key={'m-' + index}>
                                {message}
                            </AlertPanel>
                        );
                        break;
                    case 'info':
                        messages.push(
                            <AlertPanel type='info' key={'m-' + index}>
                                {message}
                            </AlertPanel>
                        );
                        break;
                    case 'danger':
                        messages.push(
                            <AlertPanel type='danger' key={'m-' + index}>
                                {message}
                            </AlertPanel>
                        );
                        break;
                    case 'warning':
                        messages.push(
                            <AlertPanel type='warning' key={'m-' + index}>
                                {message}
                            </AlertPanel>
                        );
                        break;
                    default:
                        messages.push(message);
                        break;
                }
            } else if (fragment.message) {
                messages.push(formatMessageText(fragment.message));
            } else if (fragment.link && fragment.label) {
                messages.push(
                    <a key={index++} href={fragment.link} target='_blank' rel='noopener noreferrer'>
                        {fragment.label}
                    </a>
                );
            } else if (fragment.argType === 'card') {
                const indexLabel = fragment.index > 0 ? ' (' + fragment.index + ')' : '';
                messages.push(
                    <span
                        key={index++}
                        className='card-link'
                        onMouseOver={onCardMouseOver.bind(this, fragment)}
                        onMouseOut={onCardMouseOut.bind(this)}
                    >
                        {fragment.name + indexLabel}
                    </span>
                );
            } else if (fragment.name && fragment.argType === 'player') {
                messages.push(formatPlayerChatMsg(fragment));
            } else if (fragment.argType === 'nonAvatarPlayer') {
                messages.push(formatplayerNameFragment(fragment));
            } else if (fragment.argType === 'die') {
                let diceFont = 'phg-basic-magic';

                if (fragment.magic && fragment.level && fragment.level !== 'basic') {
                    diceFont = `phg-${fragment.magic}-${fragment.level}`;
                }
                let dieClass = classNames('chat-die', fragment.magic, fragment.level);

                messages.push(
                    <span key={index++} className={dieClass}><span className={diceFont} title={`${fragment.name}`}><span className="sr-only">{fragment.code}</span></span></span>
                );
            } else if (fragment.argType === 'actions') {
                messages.push(
                    <span key={index++} >
                        {getActionFragment(fragment)}
                    </span>
                );
            } else if (fragment.argType === 'behaviour') {
                messages.push(
                    <span key={index++} className='message-fragment'>
                        {getBehaviourFragment(fragment)}
                    </span>
                );
            } else {
                let messageFragment = fragment.toString();
                messages.push(
                    <span key={index++} className='message-fragment'>
                        {messageFragment}
                    </span>
                );
            }
        }

        return messages;
    };

    return (
        <div>
            {messages.map((message, index) => {
                let className = classNames('message', {
                    'this-player': message.activePlayer && message.activePlayer == owner.name,
                    'other-player': message.activePlayer && message.activePlayer !== owner.name,
                    'chat-bubble': Object.values(message.message).some(
                        (m) => m.name && m.argType === 'player'
                    )
                });
                return (
                    <div key={message.mid} className={className}>
                        {formatMessageText(message.message, index)}
                    </div>
                );
            })}
        </div>
    );
};

Messages.displayName = 'Messages';

export default Messages;
