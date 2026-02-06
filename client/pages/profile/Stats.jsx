import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AlertPanel from '../../Components/Site/AlertPanel';
import * as actions from '../../redux/actions';

import { withTranslation, Trans } from 'react-i18next';

function Stats({ t }) {
    const [selectedTerm, setSelectedTerm] = useState(0);
    const [gameType, setGameType] = useState(null);
    const stats = useSelector((state) => state.stats && state.stats.stats);
    const apiLoading = useSelector((state) => state.api.REQUEST_USERSTATS ? state.api.REQUEST_USERSTATS.loading : undefined);
    const apiMessage = useSelector((state) => state.api.REQUEST_USERSTATS ? state.api.REQUEST_USERSTATS.message : undefined);
    const apiSuccess = useSelector((state) => state.api.REQUEST_USERSTATS ? state.api.REQUEST_USERSTATS.success : undefined);
    const dispatch = useDispatch();

    const loadUserStats = useCallback(() => {
        dispatch(actions.loadUserStats(selectedTerm, gameType));
    }, [dispatch, selectedTerm, gameType]);

    useEffect(() => {
        loadUserStats();
    }, [loadUserStats]);

    const handleChange = useCallback((event) => {
        setSelectedTerm(event.target.value);
    }, []);

    const handleTypeChange = useCallback((event) => {
        setGameType(event.target.value);
    }, []);

    const computeWinner = (game) => {
        if (
            !game.winner ||
            game.winner === game.players[0].name ||
            game.winner === game.players[1].name
        ) {
            return game.winner;
        }

        if (game.winner === game.players[0].deck) {
            return game.players[0].name;
        }

        if (game.winner === game.players[1].deck) {
            return game.players[1].name;
        }
    };

    const statRow = (pbid, stat) => {
        return (
            <tr key={'stat-' + pbid}>
                <td style={{ whiteSpace: 'nowrap' }}>{stat.name}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{stat.wins}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{stat.losses}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{stat.total}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{stat.winRate}%</td>
            </tr>
        );
    };

    let content = null;

    if (apiLoading) {
        content = (
            <div>
                Loading games from the server...
            </div>
        );
    } else if (!apiSuccess) {
        content = <AlertPanel type='error' message={apiMessage} />;
    } else {
        let statisticRows = [];
        if (stats) {
            statisticRows = Object.values(stats)
                .sort((a, b) => (a.winRate > b.winRate ? -1 : 1))
                .map((stat) => {
                    const pbid = stat.name
                        .replaceAll(' ', '-')
                        .replaceAll(',', '')
                        .toLowerCase();
                    return statRow(pbid, stat);
                });

            if (statisticRows.length > 0) {
                const totalStat = Object.values(stats).reduce(
                    (agg, current) => {
                        agg.wins += current.wins;
                        agg.losses += current.losses;

                        return agg;
                    },
                    { name: 'Total', wins: 0, losses: 0 }
                );
                totalStat.total = totalStat.wins + totalStat.losses;
                totalStat.winRate = Math.round((totalStat.wins / totalStat.total) * 100);

                statisticRows.push(statRow('total', totalStat));
            }
        }

        let table =
            statisticRows.length === 0 ? (
                <div>You have no recorded games.</div>
            ) : (
                <table className='table table-striped table-totals table-dark'>
                    <thead>
                        <tr>
                            <th>
                                <Trans>Phoenixborn</Trans>
                            </th>
                            <th>
                                <Trans>Wins</Trans>
                            </th>
                            <th>
                                <Trans>Losses</Trans>
                            </th>
                            <th>
                                <Trans>Total</Trans>
                            </th>
                            <th>
                                <Trans>Win Rate</Trans>
                            </th>
                        </tr>
                    </thead>
                    <tbody>{statisticRows}</tbody>
                </table>
            );

        content = (
            <div>
                <div className='profile full-height'>
                    <div className='col-md-6 inline'>
                        <select
                            className='form-control'
                            value={selectedTerm}
                            onChange={handleChange}
                        >
                            <option value='0'>All games</option>
                            <option value='1'>Last 1 month</option>
                            <option value='3'>Last 3 months</option>
                            <option value='12'>Last 12 months</option>
                        </select>
                    </div>
                    <div className='col-md-6 inline'>
                        <select
                            className='form-control'
                            value={gameType}
                            onChange={handleTypeChange}
                        >
                            <option value=''>All PvP</option>
                            <option value='competitive'>Ranked PvP</option>
                            <option value='casual'>Casual PvP</option>
                            <option value='solo'>Solo</option>
                        </select>
                    </div>

                    {table}
                </div>
            </div>
        );
    }

    return content;
}

Stats.displayName = 'Stats';

export default withTranslation()(Stats);
