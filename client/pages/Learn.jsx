import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';
import './Learn.scss';

import Panel from '../Components/Site/Panel';

class LearnToPlay extends React.Component {
    render() {

        return (
            <Col className='full-height' xs='12'>
                <Panel>
                    {/* <h1>Learn to Play</h1> */}
                    <h2>Learn to play Ashes Reborn</h2>
                    <div className='flex-container-row'>
                        <div className='learn-video'>
                            <h3>Watch it Played with Rodney</h3>
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
                            <h3>Team Covenant&apos;s &apos;Introducing Ashes&apos; series</h3>
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
                    </div>
                    <h3>Articles</h3>
                    <ul>
                        <li>IG intro?</li>
                    </ul>

                    <h2>Get Started with Ashteki</h2>
                    <p>would be nice to have a video series here</p>
                    <ul>
                        <li>Your first game (TC video?)</li>
                        <li>Some other nuggets that are awesome</li>
                        <li>Manual Mode explained (text from help page?)</li>
                    </ul>

                    <h2>Diving Deeper</h2>
                    <div className='flex-container-row'>
                        <div className='three-column-item'>
                            <h3>Deck Building</h3>
                            <li>IG Article</li>
                            <li>CT Video</li>
                        </div>
                        <div className='three-column-item'>
                            <h3>Adventuring Party Decks</h3>
                            <li>link to article</li>

                        </div>
                        <div className='three-column-item'>
                            <h3>Get Competitive</h3>
                            <li>Shufflebus links / videos</li>
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
