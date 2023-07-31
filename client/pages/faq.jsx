import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './faq.scss';
import chainedDeck from '../assets/img/chained-deck.png';
import chainedCard from '../assets/img/deckbuilder-chained-card.png';
import chainedGameCard from '../assets/img/game-chained-card.png';
import chainedGameCardR2 from '../assets/img/game-chained-card-green.png';
import guardedIcon from '../assets/img/guarded.png';
import '../Components/GameBoard/CardCounters.scss';

import Panel from '../Components/Site/Panel';
const FAQ = () => {
    return (
        <Col className='full-height lobby-content' xs='12'>
            <Panel type='lobby' cardClass='learn'>
                <h2>Frequently Asked Questions</h2>
                <h3>The Chained List</h3>
                <div className='faq-entry'>
                    <p>
                        PHG&apos;s Organized Play rules for Ashes Reborn include a list of cards that
                        are said to be &apos;chained&apos;. These cards may not be included in your
                        first five, or played in the first round of the game. The current chained list
                        is:
                        <ul style={{ columns: 2 }}>
                            <li>Exhortation</li>
                            <li>Explosive Growth</li>
                            <li>Massive Growth</li>
                            <li>Meteor</li>
                            <li>Psychic Vampire</li>
                            <li>River Skald</li>
                            <li>Summon Shining Hydra</li>
                            <li>Summon Sleeping Widows</li>
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

                <h3>Card Ability Icons</h3>
                <div className='faq-entry'>
                    <ul className='faq-icon-list'>
                        <li>
                            <div className='counter armor'></div>Armour
                        </li>

                        <li>
                            <div className='counter cannotBeAttackTarget'></div>Cannot be attack target
                        </li>
                        <li>
                            <div className='counter guarded'></div>Cannot guard / PB guard used
                        </li>
                        <li>
                            <div className='counter preventGuard'></div>Cannot be guarded against
                        </li>
                        <li>
                            <div className='counter cannotblock'></div>Cannot block
                        </li>
                        <li>
                            <div className='counter preventBlock'></div>Cannot be blocked
                        </li>
                        <li>
                            <div className='counter overkill'></div>overkill
                        </li>
                        <li>
                            <div className='counter terrifying'></div>terrifying
                        </li>
                        <li>
                            <div className='counter quickStrike'></div>Quick strike
                        </li>
                        <li>
                            <div className='counter grouptactics'></div>Group tactics
                        </li>
                        <li>
                            <div className='counter cannotattack'></div>Cannot attack
                        </li>
                    </ul>
                </div>
            </Panel>
        </Col>
    );
};

export default FAQ;
