import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import * as actions from '../redux/actions';

import { withTranslation, Trans } from 'react-i18next';

class Stats extends React.Component {
    componentDidMount() {
        this.props.loadUserStats();
    }

    computeKeys(player) {
        if (player.keys === null || player.keys === undefined) {
            return 0;
        }

        if (!isNaN(player.keys)) {
            return player.keys;
        }

        return player.keys.yellow + player.keys.blue + player.keys.red;
    }

    computeWinner(game) {
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
    }

    statRow(pbid, stat) {
        return (
            <tr key={'stat-' + pbid}>
                <td style={{ 'white-space': 'nowrap' }}>{stat.name}</td>
                <td style={{ 'white-space': 'nowrap' }}>{stat.wins}</td>
                <td style={{ 'white-space': 'nowrap' }}>{stat.losses}</td>
                <td style={{ 'white-space': 'nowrap' }}>{stat.total}</td>
                <td style={{ 'white-space': 'nowrap' }}>{stat.winRate}%</td>
            </tr>
        );
    }

    render() {
        let t = this.props.t;
        let content = null;

        if (this.props.apiLoading) {
            content = (
                <div>
                    <Trans>Loading matches from the server...</Trans>
                </div>
            );
        } else if (!this.props.apiSuccess) {
            content = <AlertPanel type='error' message={this.props.apiMessage} />;
        } else {
            let statisticRows = [];
            if (this.props.stats) {
                statisticRows = Object.values(this.props.stats)
                    .sort((a, b) => (a.winRate > b.winRate ? -1 : 1))
                    .map((stat) => {
                        const pbid = stat.name
                            .replaceAll(' ', '-')
                            .replaceAll(',', '')
                            .toLowerCase();
                        return this.statRow(pbid, stat);
                    });

                if (statisticRows.length > 0) {
                    const totalStat = Object.values(this.props.stats).reduce(
                        (agg, current) => {
                            agg.wins += current.wins;
                            agg.losses += current.losses;

                            return agg;
                        },
                        { name: 'Total', wins: 0, losses: 0 }
                    );
                    totalStat.total = totalStat.wins + totalStat.losses;
                    totalStat.winRate = Math.round((totalStat.wins / totalStat.total) * 100);

                    statisticRows.push(this.statRow('total', totalStat));
                }
            }

            let table =
                statisticRows.length === 0 ? (
                    <div>You have no recorded matches.</div>
                ) : (
                    <table className='table table-striped table-totals'>
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
                <div className='profile full-height'>
                    <Panel title={t('Stats')}>{table}</Panel>
                </div>
            );
        }

        return content;
    }
}

Stats.displayName = 'Stats';
Stats.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    stats: PropTypes.array,
    i18n: PropTypes.object,
    loadUserStats: PropTypes.func,
    loading: PropTypes.bool,
    t: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.REQUEST_USERSTATS ? state.api.REQUEST_USERSTATS.loading : undefined,
        apiMessage: state.api.REQUEST_USERSTATS ? state.api.REQUEST_USERSTATS.message : undefined,
        apiSuccess: state.api.REQUEST_USERSTATS ? state.api.REQUEST_USERSTATS.success : undefined,
        stats:
            state.stats &&
            state.stats.stats
        // &&
        // state.stats.games.filter(
        //     (game) =>
        //         game.players &&
        //         game.players.length === 2
        // ),
        ,
        loading: state.api.loading
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Stats));
