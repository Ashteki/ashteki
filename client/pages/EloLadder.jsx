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

                <h2>Current Rankings for Active Players</h2>
                <p>These rankings are an elo-derived value determined by wins/losses for games marked as 'Ranked' in the game setup screen. The ranking is intended as a relative indicator of skill, and not an absolute ordering of players. We don't have the volume of games to make these figures super-precise, but they should give you an indication of the kind of player you are about to meet.</p>
                <p>Players who do not play a ranked game (are 'inactive') for 3 months will not appear on this list, but will not lose their rating, or have it reduced arbitrarily. Inactive players may pick up where they left off as soon as they play a ranked game, and will again appear on this page.</p>
                <p>New players begin with a score of 1500, but will typically dip below that value while learning the ropes. Players need 12 ranked games before they will appear on this list.</p>
                <table className='elo-ladder'>
                    {output}
                </table>
            </Panel>
        </Col>
    );
};

export default EloLadder;
