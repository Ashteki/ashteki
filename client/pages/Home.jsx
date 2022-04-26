import React from 'react';
import './Home.scss';
import Link from '../Components/Navigation/Link';
import Panel from '../Components/Site/Panel';
import bookLogo from '../assets/img/open-book-svgrepo-com.svg';
import cardsLogo from '../assets/img/showHandIcon.png';
import discordTextLogo from '../assets/img/discord-logo-white.svg';

const Home = () => {
    return (
        <div className='flex-container-centered'>
            <div className='flex-container'>
                <Panel type='lobby' className='link-box'>
                    <Link className='link-box-item lobby-content' href='/play' key='play-link'>
                        <div>
                            <h2>
                                <span className='phg-main-action ashes-live-textlogo' />
                                Play Now
                            </h2>
                            <p>
                                You can jump into a game straight away. Precons and Adventuring Party decks are built-in for all users.
                            </p>
                        </div>
                    </Link>
                </Panel>
                <Panel type='lobby' className='link-box'>
                    <Link className='link-box-item lobby-content' href='/learn-to-play' key='learn-link'>
                        <div>
                            <h2>
                                <img src={bookLogo} className='bookTextlogo' />
                                Learn to Play
                            </h2>
                            <p>
                                Check out articles and videos on how to play, how to use Ashteki,
                                and much more
                            </p>
                        </div>
                    </Link>
                </Panel>
                <Panel type='lobby' className='link-box'>
                    <a
                        className='link-box-item lobby-content'
                        href='http://ashes.live'
                        key='ashes-live-link'
                    >
                        <div>
                            <h2>
                                <img src={cardsLogo} className='cardsTextlogo' />
                                Build a deck
                            </h2>
                            <p>
                                You can build a deck here on ashteki, but for the best deckbuilding
                                experience and to find other decks <br />for inspiration go to ashes.live.
                                You can then import those decks into ashteki.
                            </p>
                        </div>
                    </a>
                </Panel>
                <Panel type='lobby'>
                    <a
                        className='link-box-item lobby-content'
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://discord.gg/UU5bduq'
                    >
                        <div>
                            <h2>
                                <img src={discordTextLogo} className='textlogo' />
                                Join the Ashes Community Discord
                            </h2>
                            <ul className='two-column'>
                                <li>Find other players</li>
                                <li>Talk strategy</li>
                                <li>Get deckbuilding advice</li>
                                <li>Join a league or tournament</li>
                                <li>Ask rules questions</li>
                                <li>Report a bug</li>
                            </ul>
                        </div>
                    </a>
                </Panel>
            </div>
        </div>
    );
};

Home.displayName = 'Lobby';

export default Home;
