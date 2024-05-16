import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import PictureButton from '../Components/Lobby/PictureButton';
import './Results.scss';
import MyResults from './MyResults';
import UserAlts from './profile/UserAlts';

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
                </TabList>
                <TabPanel>
                    <MyResults />
                </TabPanel>
                <TabPanel>
                    <UserAlts />
                </TabPanel>
            </Tabs>
        </div>
    )
};

export default Results;
