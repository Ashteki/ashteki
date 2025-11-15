import React from 'react';
import { Col } from 'react-bootstrap';

import { getRankedLabel } from '../../util';

import './GameList.scss';
import GameListItem from './GameListItem';

const GameList = ({ games, onJoinOrWatchClick }) => {
    const getGamesForType = (gameType, gamesForType) => {
        const gamesToReturn = gamesForType.map((game) => (
            <GameListItem key={game.id} game={game} onJoinOrWatchClick={onJoinOrWatchClick} />
        ));

        let gameHeaderClass = 'game-header';
        switch (gameType) {
            case 'casual':
                gameHeaderClass += ' game-casual';
                break;
            case 'competitive':
                gameHeaderClass += ' game-comp';
                break;
            default:
                break;
        }

        return (
            <div key={gameType}>
                <div className={gameHeaderClass}>
                    {getRankedLabel(gameType)} ({gamesToReturn.length})
                </div>
                {gamesToReturn}
            </div>
        );
    };

    const groupedGames = {};
    for (const game of games) {
        if (!groupedGames[game.gameType]) {
            groupedGames[game.gameType] = [game];
        } else {
            groupedGames[game.gameType].push(game);
        }
    }

    const gameList = [];
    for (const gameType of ['casual', 'competitive']) {
        if (groupedGames[gameType]) {
            gameList.push(getGamesForType(gameType, groupedGames[gameType]));
        }
    }

    return <Col className='game-list'>{gameList}</Col>;
};

GameList.displayName = 'GameList';

export default GameList;
