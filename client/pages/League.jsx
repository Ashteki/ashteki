import React from 'react';
import { useSelector } from 'react-redux';

const League = ({ tag }) => {
    const tagReport = useSelector((state) => state.games.tagReport);

    return (
        <div className='col-sm-offset-1 profile full-height container'>
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
