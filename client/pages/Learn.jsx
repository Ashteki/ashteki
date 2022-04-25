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
                    <h2>Getting Started with Ashes Reborn</h2>
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
                    <h2>Getting Started with Ashteki</h2>
                    <p>would be nice to have a video series here</p>
                    <h3>Your first game</h3>
                    <h3>Manual Mode</h3>
                    <h3>Manual Mode</h3>
                    <div>tbd...</div>
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
