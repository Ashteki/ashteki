const LeagueService = require('../services/LeagueService');
const { wrapAsync } = require('../util');
const ConfigService = require('../services/ConfigService');
const GameService = require('../services/AshesGameService');

const configService = new ConfigService();
const leagueService = new LeagueService(configService);
const gameService = new GameService(configService);

module.exports.init = function (server) {
    server.get(
        '/api/league/:tag/pairings',
        // passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            const pairings = await leagueService.getLatest(req.params.tag);

            const nameLinks = await leagueService.getNameLinks();
            for (let p of pairings.pairings) {
                p.ashtekiP1 = nameLinks.find((l) => l.discordName === p.player1)?.ashtekiName;
                p.ashtekiP2 = nameLinks.find((l) => l.discordName === p.player2)?.ashtekiName;

                if (p.id) {
                    const game = await gameService.getLeagueGame(p.id);
                    if (game) {
                        p.played = true;
                    }
                }
            }

            return res.send({ success: true, pairings: pairings });
        })
    );
};
