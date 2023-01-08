import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';
import './Home.scss';

import Panel from '../Components/Site/Panel';

class LearnToPlay extends React.Component {
    render() {
        return (
            <Col className='full-height lobby-content' xs='12'>
                <Panel type='lobby' cardClass='learn'>
                    <h2>Learn to play Ashes Reborn</h2>
                    <Row className='lobby-row'>
                        <Col md='4'>
                            <h3>Plaid Hat Games</h3>
                            <p>The&nbsp;
                                <a href='https://www.plaidhatgames.com/board-games/ashes-rise-phoenixborn/'>
                                    Official Ashes Reborn page
                                </a>
                                &nbsp;has rules, FAQs, reference cards, and many other resources.

                            </p>
                        </Col>
                        <Col md='4'>
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
                        </Col>
                        <Col md='4'>
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
                        </Col>
                    </Row>
                    <Row>
                        <Col md='6'>
                            <h2>Getting Started</h2>
                            <ul >
                                <li>Play a game using the <a href='https://jaysonsethlindley.medium.com/first-adventure-dueling-decks-from-the-ashes-reborn-master-set-1d82917881fb'>First Adventure</a> decks.
                                    <p>Perfectly crafted from the core set, these dualling decks use Aradel and Saria and are a great introduction to the game.</p>
                                </li>
                                <li>
                                    Try out the <b>Building Basics</b> decks - These great starter decks use
                                    just the core set, and are built into ashteki. There are 3 pairs:
                                    <ul>
                                        <li>
                                            <a href='https://www.plaidhatgames.com/news/2020/11/04/building-basics-rise-phoenixborn/'>
                                                Jessa vs Coal
                                            </a>
                                        </li>
                                        <li>
                                            <a href='https://www.plaidhatgames.com/news/2020/12/02/building-basics-master-set-noah/'>
                                                Noah
                                            </a>{' '}
                                            vs{' '}
                                            <a href='https://www.plaidhatgames.com/news/2020/12/09/building-basics-master-set-maeoni/'>
                                                Maeoni
                                            </a>
                                        </li>
                                        <li>
                                            <a href='https://www.plaidhatgames.com/news/2020/11/18/building-basics-master-set-saria/'>
                                                Saria
                                            </a>{' '}
                                            vs{' '}
                                            <a href='https://www.plaidhatgames.com/news/2020/11/11/building-basics-master-set-aradel/'>
                                                Aradel
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    You can practise against an AI opponent on{' '}
                                    <a href='http://felttable.com/ashes'>Felt Table</a>
                                </li>
                            </ul>
                            <h3>Adventuring Party Decks</h3>
                            <p>Each of these sets by ImpossibleGerman make six decks from one collection. These decks are also great for new players to try in place of the precons</p>
                            <ul>
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
                                <li>
                                    <a href='https://jaysonsethlindley.medium.com/adventuring-party-3-a-further-six-constructed-ashes-decks-from-one-collection-bb0d20319ac3'>
                                        Adventuring Party 3
                                    </a>
                                </li>
                                <li>
                                    <a href='https://jaysonsethlindley.medium.com/adventuring-party-4-seven-constructed-ashes-decks-from-one-collection-75842c7d4a3a'>
                                        Adventuring Party 4
                                    </a>
                                </li>
                            </ul>
                        </Col>
                        <Col md='6'>
                            <h2>Diving Deeper</h2>
                            <div >
                                <h3>Deck Building</h3>
                                <p>Learn the mystic art of deckbuilding for Ashes Reborn: </p>
                                <ul>
                                    <li><a href='https://jaysonsethlindley.medium.com/colorful-cubes-foundations-of-deckbuilding-in-ashes-reborn-c49cd1abbe29'>Colorful Cubes: A Guide To Magic Types and Deckbuilding in Ashes Reborn</a></li>
                                    <li><a href='https://youtu.be/xUHvDIzFrO0'>Ashes Reborn Deckbuilding Guide</a></li>
                                    <li><a href='https://paroxysmbydesign.com/?page_id=153'>Hard 30 Essays by clu</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3>Articles</h3>
                                <ul>
                                    <li><a href='https://jaysonsethlindley.medium.com/the-big-ones-the-best-ashes-reborn-decks-and-why-they-kept-winning-3d6a579a39e' >What are the best decks in Ashes?</a></li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
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
