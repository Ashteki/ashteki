import React from 'react';
import './Home.scss';
import Link from '../Components/Navigation/Link';
import Panel from '../Components/Site/Panel';
import bookLogo from '../assets/img/open-book-svgrepo-com.svg';
import discordTextLogo from '../assets/img/discord-logo-white.svg';

const Home = () => {
    return (
        <div className='flex-container-centered'>
            <div className='flex-container'>
                <Panel className='link-box'>
                    <Link className='link-box-item' href='/play' key='play-link'>
                        <div>
                            <h3>
                                <span className='phg-main-action ashes-live-textlogo' />
                                Play Now
                            </h3>
                            <p>
                                You can jump into a game straight away. Precons and Adventuring Party decks are built-in for all users.
                            </p>
                        </div>
                    </Link>
                </Panel>
                <Panel className='link-box'>
                    <Link className='link-box-item' href='/learn-to-play' key='learn-link'>
                        <div>
                            <h3>
                                <img src={bookLogo} className='bookTextlogo' />
                                Learn to Play
                            </h3>
                            <p>
                                Check out articles and videos on how to play, how to use Ashteki,
                                and much more
                            </p>
                        </div>
                    </Link>
                </Panel>
                <Panel>
                    <a
                        className='link-box-item'
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://discord.gg/UU5bduq'
                    >
                        <div>
                            <h3>
                                <img src={discordTextLogo} className='textlogo' />
                                Join the Ashes Community Discord
                            </h3>
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
