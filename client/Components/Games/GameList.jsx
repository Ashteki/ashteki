import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';

import { getRankedLabel } from '../../util';

import * as actions from '../../redux/actions';
// ref error comment

import './GameList.scss';
import GameListItem from './GameListItem';

class GameList extends React.Component {
    constructor(props) {
        super(props);
    }

    getGamesForType(gameType, games) {
        let gamesToReturn = [];

        for (const game of games) {
            gamesToReturn.push(
                <GameListItem game={game} onJoinOrWatchClick={this.props.onJoinOrWatchClick} />
            );
        }

        let gameHeaderClass = 'game-header';
        switch (gameType) {
            case 'casual':
                gameHeaderClass += ' game-casual';
                break;
            case 'competitive':
                gameHeaderClass += ' game-comp';
                break;
        }

        return (
            <div key={gameType}>
                <div className={gameHeaderClass} key={gameType + 'header'}>
                    {getRankedLabel(gameType)} ({gamesToReturn.length})
                </div>
                {gamesToReturn}
            </div>
        );
    }

    render() {
        let groupedGames = {};

        for (const game of this.props.games) {
            if (!groupedGames[game.gameType]) {
                groupedGames[game.gameType] = [game];
            } else {
                groupedGames[game.gameType].push(game);
            }
        }

        let gameList = [];

        for (const gameType of ['casual', 'competitive']) {
            // if (this.props.gameFilter[gameType] && groupedGames[gameType]) {
            if (groupedGames[gameType]) {
                gameList.push(this.getGamesForType(gameType, groupedGames[gameType]));
            }
        }

        return (
            <Col className='game-list'>
                {gameList}
            </Col>
        );
    }
}

GameList.displayName = 'GameList';
GameList.propTypes = {
    currentGame: PropTypes.object,
    gameFilter: PropTypes.object,
    games: PropTypes.array,
    i18n: PropTypes.object,
    joinPasswordGame: PropTypes.func,
    onJoinOrWatchClick: PropTypes.func,
    showNodes: PropTypes.bool,
    socket: PropTypes.object,
    t: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.lobby.currentGame,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(GameList));
