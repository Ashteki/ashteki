import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AlertPanel from '../../Components/Site/AlertPanel';
import * as actions from '../../redux/actions';
import moment from 'moment';

function SurvivalReport() {
    const survivalStats = useSelector((state) => state.stats && state.stats.survivalStats);
    const apiLoading = useSelector((state) => state.api.REQUEST_SURVIVALSTATS ? state.api.REQUEST_SURVIVALSTATS.loading : undefined);
    const apiMessage = useSelector((state) => state.api.REQUEST_SURVIVALSTATS ? state.api.REQUEST_SURVIVALSTATS.message : undefined);
    const apiSuccess = useSelector((state) => state.api.REQUEST_SURVIVALSTATS ? state.api.REQUEST_SURVIVALSTATS.success : undefined);
    const dispatch = useDispatch();

    const loadSurvivalStats = useCallback(() => {
        dispatch(actions.loadSurvivalStats());
    }, [dispatch]);

    useEffect(() => {
        loadSurvivalStats();
    }, [loadSurvivalStats]);

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

    const gameRecord = (score) => {
        return (
            <tr>
                <td style={{ whiteSpace: 'nowrap' }} className='inset'>{score.phoenixborn}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{score.deckName}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{score.score}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{moment(score.date).format('DD-MMM-yy')}</td>
            </tr>
        )
    };

    const AspectSection = (key, stat) => {
        return (
            <>
                <tr key={'stat-' + key}>
                    <td style={{ whiteSpace: 'nowrap' }} colSpan='4'>
                        {stat.deckName}
                    </td>
                </tr>
                {stat.scores
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((s) => gameRecord(s))}
            </>
        );
    };

    if (apiLoading) {
        return (
            <div>
                Loading games from the server...
            </div>
        );
    } else if (!apiSuccess) {
        return <AlertPanel type='error' message={apiMessage} />;
    }


    let statisticRows = [];
    if (survivalStats) {
        statisticRows = Object.entries(survivalStats)
            .sort((a, b) => b - a)
            .map(([key, stat]) => {
                return AspectSection(key, stat);
            });
    }

    let table =
        statisticRows.length === 0 ? (
            <div>You have no recorded survival games - yet!</div>
        ) : (
            <table className='table table-striped table-dark'>
                <thead>
                    <tr>
                        <th className='inset'>
                            Phoenixborn
                        </th>
                        <th>
                            Deck
                        </th>

                        <th>
                            Score
                        </th>

                        <th>
                            Date
                        </th>

                    </tr>
                </thead>
                <tbody>{statisticRows}</tbody>
            </table>
        );

    return (
        <div className='profile full-height'>{table}</div>
    );
}

SurvivalReport.displayName = 'SurvivalReport';

export default SurvivalReport;
