import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import Avatar from '../Site/Avatar';
import AlertPanel from '../Site/AlertPanel';

import './Messages.scss';

const Messages = ({ messages, onCardMouseOver, onCardMouseOut }) => {
    const tokens = {
        // amber: { className: 'icon-amber', imageSrc: AmberImage }
    };

    const owner = useSelector(
        (state) => state.lobby.currentGame.players[state.lobby.currentGame.owner]
    );

    const getMessage = () => {
        return messages.map((message, index) => {
            let className = classNames('message', 'mb-1', {
                'this-player': message.activePlayer && message.activePlayer == owner.name,
                'other-player': message.activePlayer && message.activePlayer !== owner.name,
                'chat-bubble': Object.values(message.message).some(
                    (m) => m.name && m.argType === 'player'
                )
            });
            return (
                <div key={index} className={className}>
                    {formatMessageText(message.message)}
                </div>
            );
        });
    };

    const formatMessageText = (message) => {
        let index = 0;
        let messages = [];

        for (const [key, fragment] of Object.entries(message)) {
            if (fragment === null || fragment === undefined) {
                messages.push('');

                continue;
            }

            if (key === 'alert') {
                let message = formatMessageText(fragment.message);

                switch (fragment.type) {
                    case 'endofround':
                    case 'phasestart':
                        messages.push(
                            <div
                                className={'font-weight-bold text-white separator ' + fragment.type}
                                key={index++}
                            >
                                <hr className={'mt-2 mb-2' + fragment.type} />
                                {message}
                                {fragment.type === 'phasestart' && <hr />}
                            </div>
                        );
                        break;
                    case 'startofround':
                        messages.push(
                            <div
                                className={'font-weight-bold text-white separator ' + fragment.type}
                                key={index++}
                            >
                                {message}
                            </div>
                        );
                        break;
                    case 'success':
                        messages.push(
                            <AlertPanel type='success' key={index++}>
                                {message}
                            </AlertPanel>
                        );
                        break;
                    case 'info':
                        messages.push(
                            <AlertPanel type='info' key={index++}>
                                {message}
                            </AlertPanel>
                        );
                        break;
                    case 'danger':
                        messages.push(
                            <AlertPanel type='danger' key={index++}>
                                {message}
                            </AlertPanel>
                        );
                        break;
                    case 'warning':
                        messages.push(
                            <AlertPanel type='warning' key={index++}>
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
                messages.push(
                    <span
                        key={index++}
                        className='card-link'
                        onMouseOver={onCardMouseOver.bind(this, fragment)}
                        onMouseOut={onCardMouseOut.bind(this)}
                    >
                        {fragment.label}
                    </span>
                );
            } else if (fragment.name && fragment.argType === 'player') {
                let userClass =
                    'username' + (fragment.role ? ` ${fragment.role.toLowerCase()}-role` : '');

                messages.push(
                    <div key={index++} className='message-chat mb-1'>
                        <Avatar imgPath={fragment.avatar} float />
                        <span key={index++} className={userClass}>
                            {fragment.name}
                        </span>
                    </div>
                );
            } else if (fragment.argType === 'nonAvatarPlayer') {
                let userClass =
                    'username' + (fragment.role ? ` ${fragment.role.toLowerCase()}-role` : '');

                messages.push(
                    <span key={index++} className={userClass}>
                        {fragment.name}
                    </span>
                );
            } else if (fragment.argType === 'die') {
                let diceFont = 'phg-basic-magic';

                if (fragment.magic && fragment.level && fragment.level !== 'basic') {
                    diceFont = `phg-${fragment.magic}-${fragment.level}`;
                }
                let dieClass = classNames('chat-die', fragment.magic);

                messages.push(
                    <span key={index++} className={dieClass}>
                        <span className={diceFont} title={`${fragment.name}`}></span>
                    </span>
                );
            } else {
                let messageFragment = processKeywords(fragment.toString());
                messages.push(
                    <span key={index++} className='message-fragment'>
                        {messageFragment}
                    </span>
                );
            }
        }

        return messages;
    };

    const processKeywords = (message) => {
        let messages = [];
        let i = 0;

        for (let token of message.split(' ')) {
            let lowerToken = token.toLowerCase();

            if (tokens[lowerToken]) {
                let tokenEntry = tokens[lowerToken];

                switch (token) {
                    case 'amber':
                        token = 'Æmber';
                        break;
                    case 'amber.':
                        token = 'Æmber.';
                        break;
                    case 'forgedkeyblue':
                        token = 'blue key';
                        break;
                    case 'unforgedkeyblue':
                        token = 'blue key';
                        break;
                    case 'unforgedkeyred':
                        token = 'red key';
                        break;
                    case 'unforgedkeyyellow':
                        token = 'yellow key';
                        break;
                    case 'forgedkeyred':
                        token = 'red key';
                        break;
                    case 'forgedkeyyellow':
                        token = 'yellow key';
                        break;
                    default:
                        break;
                }

                messages.push(` ${token} `);
                messages.push(
                    <img
                        key={`${token}-${i++}`}
                        className={tokenEntry.className}
                        src={tokenEntry.imageSrc}
                    />
                );
                messages.push(' ');
            } else {
                messages.push(token + ' ');
            }
        }

        return messages;
    };

    return <div>{getMessage()}</div>;
};

Messages.displayName = 'Messages';

export default Messages;
