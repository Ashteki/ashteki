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
                    } else if (playedBy === loser) {
                        loserPlays++;
                    }
                }
            }

            res.send({ success: true, card: cardName, totalGames, winnerPlays, loserPlays });
        })
    );
};
