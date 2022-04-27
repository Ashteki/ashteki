import React from 'react';
import './Home.scss';
import Link from '../Components/Navigation/Link';
import Panel from '../Components/Site/Panel';
import bookLogo from '../assets/img/open-book-svgrepo-com.svg';
import cardsLogo from '../assets/img/ShowHandIcon.png';
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
                                You can jump into a game straight away. Precons and Adventuring Party decks are built in for all users.
                            </p>
                        </div>
                    </Link>
                </Panel>
                <Panel type='lobby' className='link-box'>
                    <Link className='link-box-item lobby-content' href='/learntoplay' key='learn-link'>
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
                    <a className='link-box-item lobby-content' href='/decks' key='mydecks-link'>
                        <div>
                            <h2>
                                <img src={cardsLogo} className='cardsTextlogo' />
                                Build a deck
                            </h2>
                            <p>
                                When you move beyond the built-in decks you can create your own here, or import from ashes.live
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
