import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadLeague, loadTaggedGames } from '../../redux/actions';
import Panel from '../../Components/Site/Panel';
import { Button, Form } from 'react-bootstrap';
import TaggedGameList from './TaggedGameList';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import League from '../League';

const TaggedGames = () => {
    const dispatch = useDispatch();
    const [tag, setTag] = useState('');
    const [term, setTerm] = useState(1);

    const onSubmitClick = (event) => {
        dispatch(loadTaggedGames(tag, term));
        dispatch(loadLeague(tag, term));
        event.stopPropagation();
    };

    const doShortcut = (event) => {
        setTag(event.target.value);
        dispatch(loadTaggedGames(event.target.value, term));
        dispatch(loadLeague(event.target.value, term));

        event.stopPropagation();
    };

    const handleTermChange = (event) => {
        setTerm(event.target.value);
        dispatch(loadTaggedGames(tag, event.target.value));
        dispatch(loadLeague(tag, event.target.value));

        event.stopPropagation();
    };

    return (
        <div className='lobby-card'>
            <div className='lobby-header'>Tagged Games</div>
            <Form
                inline
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmitClick(e);
                }}
            >
                <div >
                    <Button variant='primary' className='def' onClick={doShortcut} value='PHX'>
                        PHX
                    </Button>
                    <Button variant='primary' className='def' onClick={doShortcut} value='FFL'>
                        FFL
                    </Button>
                    <Form.Control
                        name='tag'
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        placeholder='Enter a tag'
                    />
                    <Button variant='primary' className='def' onClick={onSubmitClick}>
                        Search
                    </Button>
                    <select className='form-control' onChange={handleTermChange} value={term}>
                        <option value='0'>All games</option>
                        <option value='1'>Last 1 month</option>
                        <option value='3'>Last 3 months</option>
                        <option value='12'>Last 12 months</option>
                    </select>
                </div>
            </Form>
            <Tabs>
                <TabList>
                    <Tab>Standings</Tab>
                    <Tab>Games</Tab>
                </TabList>
                <TabPanel>
                    <League tag={tag} />
                </TabPanel>
                <TabPanel>
                    <TaggedGameList />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default TaggedGames;