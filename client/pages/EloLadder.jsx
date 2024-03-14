import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loadEloLadder } from '../redux/actions';
import './EloLadder.scss';


const EloLadder = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadEloLadder());
    }, []);

    const data = useSelector((state) => state.stats.elo);

    return (
        <Col className='full-height lobby-content' xs='12'>

            <div className='lobby-header'>Elo Standings</div>
            <ol className='elo-ladder-list'>
                {data && data.map((d) => {
                    return <li key={d.username}><span className='elo-username'>{d.username}</span>{d.eloRating}</li>;
                })}
            </ol>
            <p>
                Note: Only &apos;Ranked&apos; games count toward a player&apos;s elo score. Players who do not play a
                ranked game for 3 months will not appear on this list. Inactive players may pick up
                where they left off as soon as they play a ranked game. New players begin with a
                score of 1500, but will typically dip below that value while learning the ropes.
                Players need 6 ranked games before they will appear on this list.
            </p>
        </Col>
    );
};

export default EloLadder;
