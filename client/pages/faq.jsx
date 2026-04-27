import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './Home.scss';
import chainedDeck from '../assets/img/chained-deck.png';
import chainedCard from '../assets/img/deckbuilder-chained-card.png';
import chainedGameCard from '../assets/img/game-chained-card.png';
import chainedGameCardR2 from '../assets/img/game-chained-card-green.png';

import Panel from '../Components/Site/Panel';
import ManualCommands from './ManualCommands';
const FAQ = () => {
    return (
        <Row>
            <Col className='full-height lobby-content' md='6'>
                <Panel type='lobby' cardClass='lobby-card'>
                    <h2>Frequently Asked Questions</h2>
                    <h3>Where can I find an opponent?</h3>
                    <div className='faq-entry'>
                        <p>
                            Join the{' '}
                            <a
                                target='_blank'
                                rel='noopener noreferrer'
                                href='https://discord.gg/UU5bduq'
                            >
                                Ashes Community Discord
                            </a>
                            !
                        </p>
                    </div>
                    <h3>Where can I learn about the game?</h3>
                    <div className='faq-entry'>
                        <p>
                            Check out the{' '}
                            <a
                                target='_blank'
                                rel='noopener noreferrer'
                                href='https://wiki.ashes.live'
                            >
                                Ashes Wiki
                            </a> for rules, articles, and lore
                            !
                        </p>
                    </div>
                </Panel>
                <Panel type='lobby' cardClass='lobby-card'>
                    <h3>The Chained List</h3>
                    <div className='faq-entry'>
                        <p>
                            PHG&apos;s Organized Play rules for Ashes include a list of cards that
                            are said to be &apos;chained&apos;. These cards may not be included in your
                            first five, or played in the first round of the game. The current chained list
                            is:
                            <ul style={{ columns: 2 }}>
                                <li>Explosive Growth</li>
                                <li>Golden Veil</li>
                                <li>Hypnotize</li>
                                <li>Meteor</li>
                                <li>Psychic Vampire</li>
                                <li>River Skald</li>
                                <li>Silver Paladin</li>
                                <li>Summon Shining Hydra</li>
                                <li>Take to the Skies</li>
                            </ul>
                            <p>
                                In Ashteki, decks that include chained cards will display a chain link icon in the decklist and the card list
                            </p>
                            <img className='decklist-img' src={chainedDeck} />
                            <img className='deckbuilder-chained-card-img' src={chainedCard} />
                            <p>Cards on the chained list will also display a chain link icon during a game. The chain is red in the first round:</p>
                            <img className='game-chained-card-img' src={chainedGameCard} />
                            <p>and green in rounds 2 and later</p>
                            <img className='game-chained-card-img' src={chainedGameCardR2} />
                            <p>These icons are for information only. <b>Ashteki does not enforce the OP rules regarding the chained list</b></p>
                        </p>
                    </div>
                </Panel>
            </Col>
            <Col className='full-height lobby-content' md='6'>
                <Panel type='lobby' cardClass='lobby-card'>

                    <h3>Chimera Survival Mode</h3>
                    <div className='faq-entry'>
                        <p>
                            This is a survival challenge in solo mode. See how long you can last against
                            a Chimera with limitless life.
                        </p>
                        <ul>
                            <li>Choose your favorite Chimera aspect</li>
                            <li>Difficulty will start at Heroic 1 level (Threat 5)</li>
                            <li>
                                The Chimera has <b>infinite life</b> and cannot be destroyed.
                            </li>
                            <li>At the end of each round the Chimera gets +1 Threat</li>
                            <li>
                                Your goal is to see how much damage you can rack up on it before your
                                inevitable doom
                            </li>
                            <li>Track your high scores against each aspect and the deck you used</li>
                            <li>
                                Try to beat your past high scores, and share your best in the{' '}
                                <a
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    href='https://discord.gg/UU5bduq'
                                >
                                    Ashes Community Discord
                                </a>
                            </li>
                        </ul>
                    </div>
                </Panel>

                <Panel type='lobby' cardClass='lobby-card'>

                    <ManualCommands />
                </Panel>
            </Col>
        </Row >);
};

export default FAQ;
