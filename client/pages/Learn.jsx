import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';
import './Home.scss';

import Panel from '../Components/Site/Panel';

class LearnToPlay extends React.Component {
    render() {
        return (
            <Col className='full-height lobby-content' xs='12'>
                <Panel type='lobby'>
                    {/* <h1>Learn to Play</h1> */}
                    <h2>Learn to play Ashes Reborn</h2>
                    <div className='flex-container-row'>
                        <div className='learn-video'>
                            <h3>Learn the rules with Watch it Played</h3>
                            <iframe
                                width='280'
                                height='158'
                                src='https://www.youtube.com/embed/vR77Rzzc7vU'
                                title='YouTube video player'
                                frameBorder='0'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className='learn-video'>
                            <h3>Team Covenant&apos;s &apos;Introducing...&apos; series</h3>
                            <iframe
                                width='280'
                                height='158'
                                src='https://www.youtube.com/embed/HpP-Klf74uc'
                                title='YouTube video player'
                                frameBorder='0'
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className='learn-video'>
                            <h3>Articles</h3>
                            <ul>
                                <li>
                                    <a href='https://jaysonsethlindley.medium.com/phoenix-rising-a-new-player-guide-to-ashes-reborn-c93c9d5d981e'>
                                        A New Player Guide To Ashes: Reborn
                                    </a>
                                </li>
                                <li>
                                    <a href='https://beckism.com/2021/04/a-beginners-guide-to-ashes-reborn/'>
                                        A Beginners Guide to Ashes Reborn
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>


                    <h2>Get Started with Ashteki</h2>
                    <p>
                        We have plans for this section, but nothing to enjoy yet. Part 3 of the Team
                        Covenant video series linked above shows how easy it is to get up to speed,
                        but soon we also hope to have links to:
                    </p>
                    <ul>
                        <li>Setting up a game</li>
                        <li>Using the deckbuilder</li>
                        <li>Importing a deck from ashes.live</li>
                        <li>Manual Mode explained</li>
                        <li>And more besides...</li>
                    </ul>
                    <br />

                    <h2>Diving Deeper</h2>
                    <div className='flex-container-row'>
                        <div className='three-column-item'>
                            <h3>Adventuring Party Decks</h3>
                            <p>Each of these sets by ImpossibleGerman make six decks from one collection. These decks are also great for new players to try in place of the precons</p>
                            <li>
                                <a href='https://jaysonsethlindley.medium.com/adventuring-party-six-constructed-ashes-decks-from-one-collection-1a2e6a2d3260'>
                                    Adventuring Party
                                </a>
                            </li>
                            <li>
                                <a href='https://jaysonsethlindley.medium.com/adventuring-party-2-six-more-constructed-ashes-decks-from-one-collection-a66b099675b7'>
                                    Adventuring Party 2
                                </a>
                            </li>
                        </div>
                        <div className='three-column-item'>
                            <h3>Deck Building</h3>
                            <p>Learn the mystic art of deckbuilding for Ashes Reborn from this Article from ImpossibleGerman and video from ChaosTheory </p>
                            <li><a href='https://jaysonsethlindley.medium.com/colorful-cubes-foundations-of-deckbuilding-in-ashes-reborn-c49cd1abbe29'>Colorful Cubes: A Guide To Magic Types and Deckbuilding in Ashes Reborn</a></li>
                            <li><a href='https://youtu.be/xUHvDIzFrO0'>Ashes Reborn Deckbuilding Guide</a></li>
                        </div>
                        <div className='three-column-item'>
                            <h3>Get Competitive</h3>
                            <p>
                                The Shufflebus team run regular competitions, stream via twitch
                                every week (more than once!), and host articles on their website.
                            </p>
                            <li>
                                <a href='https://theshufflebus.com/shuffle-busted-a-competitive-ashes-primer/'>
                                    Shufflebus Competitive Primer
                                </a>
                            </li>
                        </div>
                    </div>
                </Panel>
            </Col>
        );
    }
}

LearnToPlay.displayName = 'About';
LearnToPlay.propTypes = {
    i18n: PropTypes.object,
    t: PropTypes.func
};

export default withTranslation()(LearnToPlay);
