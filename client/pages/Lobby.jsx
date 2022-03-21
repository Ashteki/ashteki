import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Trans, useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';

import NewsComponent from '../Components/News/News';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Typeahead from '../Components/Form/Typeahead';
import SideBar from '../Components/Lobby/SideBar';
import UserList from '../Components/Lobby/UserList';
import LobbyChat from '../Components/Lobby/LobbyChat';
import { clearChatStatus, loadNews, removeLobbyMessage, sendSocketMessage } from '../redux/actions';
import { News } from '../redux/types';
import discordTextLogo from '../assets/img/discord-logo-white.svg';
import githubLogo from '../assets/img/GitHub-Mark-Light-64px.png';
import patreonLogo from '../assets/img/Patreon-Coral.png';
import './Lobby.scss';
import { useRef } from 'react';

const Lobby = () => {
    const dispatch = useDispatch();
    const { bannerNotice, lobbyError, messages, motd, users } = useSelector((state) => ({
        bannerNotice: state.lobby.bannerNotice,
        lobbyError: state.lobby.lobbyError,
        messages: state.lobby.messages,
        motd: state.lobby.motd,
        users: state.lobby.users
    }));
    const user = useSelector((state) => state.account.user);
    const news = useSelector((state) => state.news.news);
    const apiState = useSelector((state) => {
        const retState = state.api[News.RequestNews];

        return retState;
    });
    const [popupError, setPopupError] = useState(false);
    const [message, setMessage] = useState('');
    const { t } = useTranslation();
    const messageRef = useRef(null);

    useEffect(() => {
        dispatch(loadNews({ limit: 3 }));
    }, [dispatch]);

    if (!popupError && lobbyError) {
        setPopupError(true);

        toastr.error('Error', 'New users are limited from chatting in the lobby, try again later');

        setTimeout(() => {
            dispatch(clearChatStatus());
            setPopupError(false);
        }, 5000);
    }

    const sendMessage = () => {
        if (message === '') {
            return;
        }

        dispatch(sendSocketMessage('lobbychat', message));

        setMessage('');
    };

    const onKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            sendMessage();

            messageRef.current?.clear();
        }
    };

    let isLoggedIn = !!user;
    let placeholder = isLoggedIn
        ? 'Enter a message...'
        : 'You must be logged in to send lobby chat messages';

    return (
        <div className='flex-container'>
            <SideBar>
                <UserList users={users} />
            </SideBar>
            {motd?.message && (
                <div>
                    <Col sm={{ span: 10, offset: 1 }} className='banner'>
                        <AlertPanel type={motd.motdType} message={motd.message}></AlertPanel>
                    </Col>
                </div>
            )}
            {bannerNotice && (
                <div>
                    <Col sm={{ span: 10, offset: 1 }} className='annoucement'>
                        <AlertPanel message={bannerNotice} type='error' />
                    </Col>
                </div>
            )}

            {/* <div>
                <Col sm={{ span: 10, offset: 1 }}>
                    <Panel title={t('Latest site news')}>
                        {apiState?.loading ? (
                            <div>
                                <Trans>News loading, please wait...</Trans>
                            </div>
                        ) : null}
                        <NewsComponent news={news} />
                    </Panel>
                </Col>
            </div> */}
            <Row className='h-100'>
                <Col sm={{ span: 8 }} className='chat-container'>
                    <Panel
                        title={t('Lobby Chat ({{users}}) online', {
                            users: users.length
                        })}
                    >
                        <div>
                            <LobbyChat
                                messages={messages}
                                isModerator={user?.permissions?.canModerateChat}
                                onRemoveMessageClick={(messageId) =>
                                    dispatch(removeLobbyMessage(messageId))
                                }
                            />
                        </div>
                    </Panel>
                    <form
                        className='form form-hozitontal chat-box-container'
                        onSubmit={(event) => {
                            event.preventDefault();
                            sendMessage();
                        }}
                    >
                        <div className='form-group'>
                            <div className='chat-box'>
                                <Typeahead
                                    disabled={!isLoggedIn}
                                    ref={messageRef}
                                    value={message}
                                    placeholder={t(placeholder)}
                                    labelKey={'name'}
                                    onKeyDown={onKeyPress}
                                    options={users}
                                    onInputChange={(value) => setMessage(value)}
                                    autoFocus
                                    dropup
                                    emptyLabel={''}
                                    minLength={2}
                                />
                            </div>
                        </div>
                    </form>
                </Col>
                <Col sm={{ span: 4 }}>
                    <Panel>
                        <div className='link-box'>
                            <a
                                className='link-box-item'
                                target='_blank'
                                rel='noopener noreferrer'
                                href='https://discord.gg/UU5bduq'

                            >
                                <div className='phg-main-action ashes-live-textlogo' />
                                <div>
                                    <h3 className='caption'>Ashes.live Deck builder</h3>
                                    <p>
                                        The best way to browse cards and build decks. <br /> You can import them into Ashteki when you're ready to play.
                                    </p>
                                </div>
                            </a>
                            <a
                                className='link-box-item'
                                target='_blank'
                                rel='noopener noreferrer'
                                href='https://discord.gg/UU5bduq'

                            >
                                <img src={discordTextLogo} className='textlogo' />
                                <div>
                                    <h3 className='caption'>Join the Ashes Community Discord</h3>
                                    <ul>
                                        <li>Find other players</li>
                                        <li>Talk strategy</li>
                                        <li>Get deckbuilding advice</li>
                                        <li>Join a league or tournament</li>
                                        <li>Ask rules questions</li>
                                    </ul>
                                </div>
                            </a>
                            <a
                                className='link-box-item'
                                target='_blank'
                                rel='noopener noreferrer'
                                href='https://www.patreon.com/ashteki'

                            >
                                <img src={patreonLogo} className='textlogo' />
                                <div>
                                    <h3 className='caption'>Support the site</h3>
                                    <p>
                                        Ashteki wouldn't be here without support from our amazing
                                        patrons who pay for hosting the site. If you would like to
                                        contribute, then click here.
                                    </p>
                                </div>
                            </a>
                            <a
                                className='link-box-item'
                                target='_blank'
                                rel='noopener noreferrer'
                                href='https://github.com/danj3000/ashteki/issues'
                            >
                                <img src={githubLogo} className='textlogo' />
                                <div>
                                    <h3 className='caption'>Submit a bug report</h3>
                                    <p>
                                        The code for ashteki is hosted in github. You can submit
                                        feature requests and bug reports directly there, or
                                        alternatively find us in the ashes discord #software-dev
                                        channel
                                    </p>
                                </div>
                            </a>
                        </div>
                    </Panel>
                </Col>
            </Row>
        </div >
    );
};

Lobby.displayName = 'Lobby';

export default Lobby;
