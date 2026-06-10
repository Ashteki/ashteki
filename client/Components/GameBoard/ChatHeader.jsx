import React from 'react';
import { faComment, faCommentSlash, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SpectatorIcon from './SpectatorIcon';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ChatHeader = ({ muteSpectators, onMuteClick }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const writeChatToClipboard = (event) => {
        event.preventDefault();
        let messagePanel = document.getElementsByClassName('messages panel')[0];
        if (messagePanel) {
            navigator.clipboard
                .writeText(messagePanel.innerText)
                .then(() => toast.success('Copied game chat to clipboard'))
                .catch((err) => toast.error(`Could not copy game chat: ${err}`));
        }
    };

    return (
        <div className='chat-header'>
            Round {currentGame.round}&nbsp;|&nbsp;
            <SpectatorIcon />
            &nbsp;
            <a
                href='#'
                className='pr-1 pl-1'
                title='Mute spectators'
                tabIndex={-1}
                aria-hidden='true'
            >
                <FontAwesomeIcon
                    icon={muteSpectators ? faCommentSlash : faComment}
                    onClick={onMuteClick}
                ></FontAwesomeIcon>
            </a>|&nbsp;
            <a
                href='#'
                className='pr-1 pl-1'
                title='Copy chat to clipboard'
                tabIndex={-1}
                aria-hidden='true'
            >
                <FontAwesomeIcon icon={faCopy} onClick={writeChatToClipboard}></FontAwesomeIcon>
            </a>
        </div>
    );
};

export default ChatHeader;
