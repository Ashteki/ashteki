import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadLeague } from '../redux/actions';

const League = ({ tag }) => {
    const dispatch = useDispatch();
    const tagReport = useSelector((state) => state.games.tagReport);
    const [season, setSeason] = useState(2);

    useEffect(() => {
        dispatch(loadLeague(tag, season));
    }, [dispatch, tag, season]);

    const handleSeasonChange = (event) => {
        setSeason(event.target.value);
        event.stopPropagation();
    };

    return (
        <div className='col-sm-offset-1 profile full-height container'>
            {/* <div className='col-md-6 inline'>
                <select className='form-control' onChange={handleSeasonChange} value={season}>
                    <option value='2'>Season 2 (Current)</option>
                    <option value='1'>Season 1</option>
                </select>
            </div> */}

            {tagReport && tagReport.length === 0 ? (
                <div>No recorded games.</div>
            ) : (
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Count</th>
                            <th>Wins</th>
                            <th>Win Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tagReport && tagReport.map((record) => {
                            const winRate = Math.round((record.wins / record.count) * 100);

                            return (
                                <tr key={record.name}>
                                    <td>{record.name}</td>
                                    <td>{record.count}</td>
                                    <td>{record.wins}</td>
                                    <td>{winRate}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default League;
