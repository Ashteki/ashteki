import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import PictureButton from '../Components/Lobby/PictureButton';
import './Results.scss';
import EloLadder from './EloLadder';
import MyResults from './MyResults';
import UserAlts from './profile/UserAlts';
import League from './League';

const Results = () => {
    return (
        <div className='lobby-card results-page'>
            <Tabs>
                <TabList>
                    <Tab>
                        <PictureButton text='My Results' imageClass='stats-link' />
                    </Tab>
                    <Tab>
                        <PictureButton text='Alt Arts' imageClass='alts-link' />
                    </Tab>
                    <Tab>
                        <PictureButton text='Elo Standings' imageClass='elo-link' />
                    </Tab>
                </TabList>
                <TabPanel>
                    <MyResults />
                </TabPanel>
                <TabPanel>
                    <UserAlts />
                </TabPanel>
                <TabPanel>
                    <EloLadder key='elo' />
                </TabPanel>
            </Tabs>
        </div >
    )
};

export default Results;
