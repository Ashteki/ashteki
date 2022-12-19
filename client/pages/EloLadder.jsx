import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Panel from '../Components/Site/Panel';
import { loadEloLadder } from '../redux/actions';
import './EloLadder.scss';


const EloLadder = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadEloLadder());
    }, []);

    const data = useSelector((state) => state.stats.elo);
    const output = data && data.map((d, index) => {
        return <tr key={d.username}><td>{index + 1}</td><td> {d.username}</td><td>{d.eloRating}</td></tr>;
    });

    return (
        <Col className='full-height lobby-content' xs='12'>
            <Panel type='lobby' cardClass='learn'>

                <h2>Elo Leaderboard</h2>
                <table className='elo-ladder'>
                    {output}
                </table>
            </Panel>
        </Col>
    );
};

export default EloLadder;
