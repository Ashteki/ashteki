import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Messages from './Messages';

import './GameChat.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCommentSlash, faCopy, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toastr } from 'react-redux-toastr';
import { debounce } from 'underscore';
import ChatHeader from './ChatHeader';

class GameChat extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.state = {
            canScroll: true,
            message: ''
        };
    }

    componentDidMount() {
        if (this.state.canScroll) {
            $(this.messagePanel).scrollTop(999999);
        }
    }

    componentDidUpdate() {
        if (this.state.canScroll) {
            $(this.messagePanel).scrollTop(999999);
        }
    }

    onScroll() {
        let messages = this.messagePanel;

        setTimeout(() => {
            if (messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                this.setState({ canScroll: true });
            } else {
                this.setState({ canScroll: false });
            }
        }, 500);
    }

    handleTyping = debounce(function () {
        // continually delays setting "isTyping" to false for 500ms until the user has stopped typing and the delay runs out
        this.setState({ isTyping: false });
        this.props.onPlayerTyping(false);
    }, 2000);

    onChange(event) {
        if (!this.state.isTyping) {
            this.props.onPlayerTyping(true);
        }
        this.setState({ isTyping: true, message: event.target.value }, () => {
            // allows user input updates and continually sets "isTyping" to true
            this.handleTyping();
        });
    }

    onKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();

            event.preventDefault();
        }
    }

    sendMessage() {
        if (this.state.message === '') {
            return;
        }

        this.props.onSendChat(this.state.message);

        this.setState({ message: '' });
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
    };


    render() {
        let placeholder = this.props.muted ? 'Spectators cannot chat in this game' : 'Chat...';

        return (
            <div className='chat'>
                <ChatHeader muteSpectators={this.props.muteSpectators} onMuteClick={this.props.onMuteClick} />
                <div
                    className='messages panel'
                    ref={(m) => (this.messagePanel = m)}
                    onScroll={this.onScroll}
                >
                    <Messages
                        messages={this.props.messages}
                        onCardMouseOver={this.props.onCardMouseOver}
                        onCardMouseOut={this.props.onCardMouseOut}
                    />
                </div>
                <form className='form chat-form'>
                    <input
                        className='form-control'
                        placeholder={placeholder}
                        onKeyPress={this.onKeyPress}
                        onChange={this.onChange}
                        value={this.state.message}
                        disabled={this.props.muted}
                    />
                </form>
            </div>
        );
    }
}

GameChat.displayName = 'GameChat';
GameChat.propTypes = {
    messages: PropTypes.array,
    muted: PropTypes.bool,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    onSendChat: PropTypes.func
};

export default GameChat;
