import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Stats from './profile/Stats';
import Matches from './Matches';

const MyResults = () => {
    return (
        <>
            <div className='lobby-header'>My Results</div>
            <div className='container'>
                <Tabs>
                    <TabList>
                        <Tab><span className='lobby-header'>Phoenixborn Stats</span></Tab>
                        <Tab><span className='lobby-header'>Game List</span></Tab>
                    </TabList>
                    <TabPanel>
                        <Stats />
                    </TabPanel>
                    <TabPanel>
                        <Matches />
                    </TabPanel>
                </Tabs>
            </div >
        </>
    )
};

export default MyResults;
