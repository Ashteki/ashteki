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
            const dt = new Date();
            dt.setMonth(dt.getMonth() - 1);

            let list = await userService.getAllUsers();
            list = list.filter((u) => u.eloRating && u.lastRankedGame > dt && u.rankedGamesPlayed > 12);
            list.sort((a, b) => (a.eloRating > b.eloRating ? -1 : 1));
            res.send({ success: true, list: list });
        })
    );
};
