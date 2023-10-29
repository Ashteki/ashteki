import React from 'react';
import { faComment, faCommentSlash, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toastr } from 'react-redux-toastr';
import { useSelector } from 'react-redux';

const ChatHeader = ({ muteSpectators, onMuteClick }) => {
    const typing = useSelector((state) => state.lobby.currentGame.opponentTyping);

    const writeChatToClipboard = (event) => {
        event.preventDefault();
        let messagePanel = document.getElementsByClassName('messages panel')[0];
        if (messagePanel) {
            navigator.clipboard
                .writeText(messagePanel.innerText)
                .then(() => toastr.success('Copied game chat to clipboard'))
                .catch((err) => toastr.error(`Could not copy game chat: ${err}`));
        }
    };

    return (
        <div className='chat-header'>
            {typing && <span>TYPING</span>}
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
            </a>
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
