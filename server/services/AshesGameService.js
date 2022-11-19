const _ = require('underscore');
const monk = require('monk');

const logger = require('../log.js');
const moment = require('moment');

class GameService {
    constructor(configService) {
        const mongoUrl = process.env.MONGO_URL || configService.getValue('mongo');
        let db = monk(mongoUrl);
        this.games = db.get('games');
    }

    create(game) {
        return this.games.insert(game).catch((err) => {
            logger.error('Unable to create game', err);
            throw new Error('Unable to create game');
        });
    }

    update(game) {
        let properties = {
            startedAt: new Date(game.startedAt),
            players: game.players,
            winner: game.winner,
            winReason: game.winReason,
            finishedAt: new Date(game.finishedAt)
        };
        return this.games.update({ gameId: game.gameId }, { $set: properties }).catch((err) => {
            logger.error('Unable to update game', err);
            throw new Error('Unable to update game');
        });
    }

    getAllGames(from, to) {
        return this.games
            .find()
            .then((games) => {
                return _.filter(games, (game) => {
                    const start = new Date(game.startedAt);
                    return start >= from && start < to;
                });
            })
            .catch((err) => {
                logger.error('Unable to get all games from', from, 'to', to, err);
                throw new Error('Unable to get all games');
            });
    }

    getTaggedGames(tag) {
        const findSpec = {
            label: tag
        };
        return this.games
            .find(findSpec, {
                sort: {
                    finishedAt: -1
                }
            })
            .catch((err) => {
                logger.error('Unable to get all games tagged ', tag, err);
                throw new Error('Unable to get tagged games');
            });
    }

    async findByUserName(username) {
        return this.games
            .find(
                {
                    'players.name': username
                },
                {
                    sort: {
                        finishedAt: -1
                    }
                }
            )
            .then((games) => {
                // Make sure position zero is always the given username
                games.forEach((game) => {
                    if (game.players && game.players[0] && game.players[1]) {
                        if (game.players[1].name === username) {
                            let opponent = game.players[0];
                            game.players[0] = game.players[1];
                            game.players[1] = opponent;
                        }
                    }
                });

                return games;
            });
    }

    async getStatsByUserName(username, mon, gameType) {
        const findSpec = {
            'players.name': username,
            'players.deck': { $ne: null }
        };
        if (mon && mon > 0) {
            const fromDate = moment().subtract(mon, 'months');
            findSpec.startedAt = { $gt: fromDate.toDate() };
        }
        if (gameType) {
            findSpec.gameType = gameType;
        }
        return this.games
            .find(findSpec, {
                sort: {
                    finishedAt: -1
                }
            })
            .then((games) => {
                let pbs = {};
                games.forEach((game) => {
                    if (game.players && game.players[0] && game.players[1]) {
                        // which pb?
                        let phoenixborn =
                            game.players[0].name === username
                                ? game.players[0].deck
                                : game.players[1].deck;

                        // have we got a record?
                        if (!pbs[phoenixborn])
                            pbs[phoenixborn] = { name: phoenixborn, wins: 0, losses: 0 };

                        // increment the record win/loss
                        if (game.winReason !== 'Agreement') {
                            if (game.winner === username) {
                                pbs[phoenixborn].wins++;
                            } else {
                                pbs[phoenixborn].losses++;
                            }
                        }
                    }
                });
                Object.values(pbs).forEach((stat) => {
                    stat.total = stat.wins + stat.losses;
                    stat.winRate = Math.round((stat.wins / stat.total) * 100);
                });
                return pbs;
            });
    }
}

module.exports = GameService;
