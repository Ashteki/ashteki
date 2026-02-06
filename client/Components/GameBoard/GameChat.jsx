import React, { useState, useRef, useCallback, useEffect } from 'react';
import $ from 'jquery';

import Messages from './Messages';

import './GameChat.scss';
import { toastr } from 'react-redux-toastr';
import { debounce } from 'underscore';
import ChatHeader from './ChatHeader';
import typingIndicator from '../../assets/img/typing-dots.gif';
import { useSelector } from 'react-redux';

function GameChat({ messages, muted, onCardMouseOut, onCardMouseOver, onSendChat, onMuteClick, muteSpectators }) {
    const oppTyping = useSelector((s) => s.lobby.currentGame?.opponentTyping);

    const [canScroll, setCanScroll] = useState(true);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagePanelRef = useRef(null);
    const handleTypingRef = useRef(
        debounce(function () {
            setIsTyping(false);
            onPlayerTyping(false);
        }, 2000)
    );

    useEffect(() => {
        if (canScroll && messagePanelRef.current) {
            $(messagePanelRef.current).scrollTop(999999);
        }
    }, [canScroll, messages]);

    const onScroll = useCallback(() => {
        const messages = messagePanelRef.current;

        setTimeout(() => {
            if (messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                setCanScroll(true);
            } else {
                setCanScroll(false);
            }
        }, 500);
    }, []);

    const onChange = useCallback(
        (event) => {
            if (!isTyping) {
                onPlayerTyping(true);
            }
            setIsTyping(true);
            setMessage(event.target.value);
            handleTypingRef.current();
        },
        [isTyping]
    );

    const onKeyPress = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                sendMessage();
                event.preventDefault();
            }
        },
        [message]
    );

    const sendMessage = useCallback(() => {
        if (message === '') {
            return;
        }

        onSendChat(message);
        setMessage('');
    }, [message, onSendChat]);

    const onPlayerTyping = useCallback((typing) => {
        // This callback is meant to be called from the parent or from within this component
        // If needed, this would be passed as a prop
    }, []);

    const placeholder = muted ? 'Spectators cannot chat in this game' : 'Chat...';

    return (
        <div className='chat'>
            <ChatHeader muteSpectators={muteSpectators} onMuteClick={onMuteClick} />
            <div className='messages panel' ref={messagePanelRef} onScroll={onScroll}>
                <Messages
                    messages={messages}
                    onCardMouseOver={onCardMouseOver}
                    onCardMouseOut={onCardMouseOut}
                />
            </div>
            {oppTyping && (
                <img
                    className='typing-indicator'
                    title='Opponent is typing...'
                    src={typingIndicator}
                />
            )}
            <form className='form chat-form'>
                <input
                    className='form-control'
                    placeholder={placeholder}
                    onKeyPress={onKeyPress}
                    onChange={onChange}
                    value={message}
                    disabled={muted}
                />
            </form>
        </div>
    );
}

GameChat.displayName = 'GameChat';

export default GameChat;
