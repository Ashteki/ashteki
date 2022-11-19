const passport = require('passport');

const GameService = require('../services/AshesGameService.js');
const ConfigService = require('../services/ConfigService.js');
const { wrapAsync } = require('../util.js');

let gameService = new GameService(new ConfigService());

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

};
