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
            finishedAt: new Date(game.finishedAt),
            auditReport: game.auditReport
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

    getTaggedGames(tag, options) {
        const findSpec = {
            label: { $exists: true, $ne: null }
        };
        if (tag !== '') {
            findSpec.label = tag;
        }
        if (options.months && options.months > 0) {
            const fromDate = moment().subtract(options.months, 'months');
            findSpec.startedAt = { $gt: fromDate.toDate() };
        }
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

    getTagReport(tag, options) {
        const findSpec = {
            label: tag
        };
        findSpec.winner = { $exists: true };
        findSpec.winReason = { $ne: 'Agreement' };

        // season currently used only for PHX
        if (options.season === 2) {
            // from date
            const fromDate = new Date('2023-11-23');
            findSpec.startedAt = { $gt: fromDate };
        }
        if (options.season === 1) {
            // from date
            const toDate = new Date('2023-11-23');
            findSpec.startedAt = { $lt: toDate };
        }

        // ignore FFL games before 23 relaunch
        if (tag === 'FFL') {
            const fromDate = new Date('2023-01-01');
            findSpec.startedAt = { $gt: fromDate };
        }

        // return only those from paired matchups
        if (options.pairings) {
            findSpec.pairing = { $ne: null };
        }

        // limit date by latest x months
        if (options.months) {
            if (options.months && options.months > 0) {
                const fromDate = moment().subtract(options.months, 'months');
                findSpec.startedAt = { $gt: fromDate.toDate() };
            }
        }

        return this.games
            .find(findSpec, {
                sort: {
                    finishedAt: -1
                }
            })
            .then((results) => {
                const output = results.reduce((agg, game) => {
                    game.players.forEach(p => {
                        let player = agg.find((pl) => pl.name === p.name);
                        if (player) {
                            player.count += 1;
                        } else {
                            player = { name: p.name, count: 1, wins: 0 };
                            agg.push(player);
                        }

                        if (player.name === game.winner) {
                            player.wins += 1;
                        }
                    });
                    return agg;
                }, []);
                return output.sort((a, b) => a.wins > b.wins ? -1 : 1);
            })
            .catch((err) => {
                logger.error('Unable to get TAG REPORT ', tag, err);
                throw new Error('Unable to get tag report');
            });
    }

    getGameById(id) {
        const findSpec = {
            gameId: id
        };
        return this.games.findOne(findSpec).catch((err) => {
            logger.error('Unable to get game: ', id, err);
            throw new Error('Unable to get game');
        });
    }

    getLeagueGame(id) {
        const findSpec = {
            'pairing.id': id,
            finishedAt: { $ne: null }
        };
        return this.games.findOne(findSpec).catch((err) => {
            logger.error('Unable to get league game: ', id, err);
            throw new Error('Unable to get league game');
        });
    }

    async findByUserName(username, options = {}) {
        const findSpec = {
            'players.name': username
        };
        if (!options.includeNonWins) {
            findSpec.winner = { $exists: true };
            findSpec.winReason = { $ne: 'Agreement' };
        }
        if (options.months && options.months > 0) {
            const fromDate = moment().subtract(options.months, 'months');
            findSpec.startedAt = { $gt: fromDate.toDate() };
        }
        if (!options.solo) {
            findSpec.solo = { $ne: true };
        }
        if (options.gameType) {
            findSpec.gameType = options.gameType;
        }

        return this.games
            .find(findSpec, {
                sort: {
                    finishedAt: -1
                }
            })
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
            'players.deck': { $ne: null },
            gameType: { $ne: 'beginner' },
            solo: { $ne: true }
        };
        if (mon && mon > 0) {
            const fromDate = moment().subtract(mon, 'months');
            findSpec.startedAt = { $gt: fromDate.toDate() };
        }
        if (gameType) {
            if (gameType === 'solo') {
                findSpec.solo = true;
            } else {
                findSpec.gameType = gameType;
            }
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
                        if (game.winReason && game.winReason !== 'Agreement') {
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
