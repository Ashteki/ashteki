import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import * as actions from '../redux/actions';

import { withTranslation, Trans } from 'react-i18next';

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTerm: 0,
            gameType: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
    }

    loadUserStats() {
        this.props.loadUserStats(this.state.selectedTerm, this.state.gameType);
    }

    handleChange(event) {
        this.setState({ selectedTerm: event.target.value }, () => {
            this.loadUserStats();
        });
    }
    handleTypeChange(event) {
        this.setState({ gameType: event.target.value }, () => {
            this.loadUserStats();
        });
    }
    componentDidMount() {
        this.loadUserStats();
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
        const dropdown = (
            <select
                className='form-control'
                value={this.state.selectedTerm}
                onChange={this.handleChange}
            >
                <option value='0'>All games</option>
                <option value='1'>Last 1 month</option>
                <option value='3'>Last 3 months</option>
                <option value='12'>Last 12 months</option>
            </select>
        )

        const gtDropdown = (
            <select
                className='form-control'
                value={this.state.gameType}
                onChange={this.handleTypeChange}
            >
                <option value=''>All Types</option>
                <option value='competitive'>Ranked</option>
                <option value='casual'>Casual</option>
            </select>
        )

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
                <div>
                    <div className='profile full-height'>
                        <Panel title={t('Stats')}>
                            <div className='col-md-6 inline'>{dropdown}</div>
                            <div className='col-md-6 inline'>{gtDropdown}</div>

                            {table}
                        </Panel>
                    </div>
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
