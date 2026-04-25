const passport = require('passport');
const { wrapAsync } = require('../util.js');

const ConfigService = require('../services/ConfigService.js');
const GameService = require('../services/AshesGameService.js');
const UserService = require('../services/AshesUserService');

const configService = new ConfigService();
const gameService = new GameService(configService);
const userService = new UserService(new ConfigService());

module.exports.init = function (server) {
    server.get(
        '/api/stats',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let stats = await gameService.getStatsByUserName(
                req.user.username,
                req.query.months,
                req.query.gameType
            );
            res.send({ success: true, stats: stats });
        })
    );

    server.get(
        '/api/stats/elo',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            const dtCutoff = new Date();
            dtCutoff.setMonth(dtCutoff.getMonth() - 3);

            let list = await userService.getAllUsers();
            list = list.filter(
                (u) => u.eloRating && u.lastRankedGame > dtCutoff && u.rankedGamesPlayed >= 6 &&
                    !u.settings?.eloOptOut
            );
            list.sort((a, b) => (a.eloRating > b.eloRating ? -1 : 1));
            res.send({ success: true, list: list });
        })
    );

    server.get(
        '/api/cardstats',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions?.isAdmin) {
                return res.status(403).send({ message: 'Unauthorized' });
            }

            let cardName = req.query.card;
            if (!cardName) {
                return res.status(400).send({ message: 'Card name required' });
            }

            let includeSolo = req.query.includeSolo === 'true';

            let findSpec = {
                winner: { $exists: true },
                winReason: { $ne: 'Agreement' },
                chat: { $exists: true, $ne: '' }
            };
            if (!includeSolo) {
                findSpec.solo = { $ne: true };
            }

            let games = await gameService.games.find(findSpec);

            let totalGames = 0;
            let winnerPlays = 0;
            let loserPlays = 0;
            let totalPlays = 0;

            for (let game of games) {
                let players = game.players.map(p => p.name);
                let winner = game.winner;
                let loser = players.find(p => p !== winner);

                let chat = game.chat || '';
                let escapedCard = cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                let regex = new RegExp(`(${players[0]}|${players[1]}) plays ${escapedCard}`, 'gi');
                let matches = chat.match(regex);

                if (matches && matches.length > 0) {
                    totalGames++;
                    let playedBy = matches[0].match(/^([^ ]+) plays/)[1];
                    if (playedBy === winner) {
                        winnerPlays++;
                        totalPlays++;
                    } else if (playedBy === loser) {
                        loserPlays++;
                        totalPlays++;
                    }
                }
            }

            res.send({ success: true, card: cardName, totalGames, winnerPlays, loserPlays, totalPlays });
        })
    );

    server.get(
        '/api/cardstats/csv',
        wrapAsync(async function (req, res) {

            let start = req.query.start ? new Date(req.query.start) : null;
            let end = req.query.end ? new Date(req.query.end) : null;
            let includeSolo = req.query.includeSolo === 'true';
            let ranked = req.query.ranked === 'true';

            if ((start && isNaN(start.getTime())) || (end && isNaN(end.getTime()))) {
                return res.status(400).send({ message: 'Invalid date format' });
            }

            let findSpec = {
                winner: { $exists: true },
                winReason: { $ne: 'Agreement' },
                chat: { $exists: true, $ne: '' }
            };
            if (!includeSolo) {
                findSpec.solo = { $ne: true };
            }
            if (ranked) {
                findSpec.gameType = 'competitive';
            }
            if (start) {
                findSpec.finishedAt = findSpec.finishedAt || {};
                findSpec.finishedAt.$gte = start;
            }
            if (end) {
                findSpec.finishedAt = findSpec.finishedAt || {};
                findSpec.finishedAt.$lt = end;
            }

            let games = await gameService.games.find(findSpec);

            let cardStats = {};

            games.forEach((game) => {
                if (!game.winner || game.winReason === 'Agreement' || !game.chat || game.chat === '') {
                    return;
                }

                let players = game.players.map(p => p.name);
                let isSolo = game.solo || players.length !== 2;
                if (!includeSolo && isSolo) {
                    return;
                }

                let winner = game.winner;
                let loser = isSolo ? null : players.find(p => p !== winner);

                let chat = game.chat;
                let cardsSeen = {};
                let playRegex = /(?:^|: )([^\s]+) plays ([^\n\r]+)/gm;
                let match;
                while ((match = playRegex.exec(chat)) !== null) {
                    let playerName = match[1];
                    let cardName = match[2].trim();
                    cardName = cardName.replace(/\s+(?:attaching it to|to|and)[\s\S]*$/i, '').trim();

                    if (!cardsSeen[cardName]) {
                        cardsSeen[cardName] = {
                            winnerPlayed: false,
                            loserPlayed: false,
                            players: new Set()
                        };
                    }

                    cardsSeen[cardName].players.add(playerName);
                    if (playerName === winner) {
                        cardsSeen[cardName].winnerPlayed = true;
                    } else if (loser && playerName === loser) {
                        cardsSeen[cardName].loserPlayed = true;
                    }
                }

                Object.keys(cardsSeen).forEach((cardName) => {
                    if (!cardStats[cardName]) {
                        cardStats[cardName] = { totalGames: 0, winnerPlays: 0, loserPlays: 0, totalPlays: 0, players: new Set() };
                    }

                    cardStats[cardName].totalGames++;
                    if (cardsSeen[cardName].winnerPlayed) {
                        cardStats[cardName].winnerPlays++;
                        cardStats[cardName].totalPlays++;
                    }
                    if (cardsSeen[cardName].loserPlayed) {
                        cardStats[cardName].loserPlays++;
                        cardStats[cardName].totalPlays++;
                    }
                    cardsSeen[cardName].players.forEach((playerName) => cardStats[cardName].players.add(playerName));
                });
            });

            let csv = 'Card Name,Total Games,Winner Plays,Loser Plays,Total Plays,Win %,Unique Players\n';
            Object.keys(cardStats).forEach((cardName) => {
                const stats = cardStats[cardName];
                const winPercent = stats.totalGames > 0 ? Math.round((stats.winnerPlays / stats.totalGames) * 100) : 0;
                const uniquePlayerCount = stats.players.size;
                csv += `"${cardName.replace(/"/g, '""')}",${stats.totalGames},${stats.winnerPlays},${stats.loserPlays},${stats.totalPlays},${winPercent},${uniquePlayerCount}\n`;
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="card_play_stats.csv"');
            res.send(csv);
        })
    );
};
