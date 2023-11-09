const passport = require('passport');

const GameService = require('../services/AshesGameService.js');
const ConfigService = require('../services/ConfigService.js');
const { wrapAsync } = require('../util.js');
const AshesDeckService = require('../services/AshesDeckService.js');

const configService = new ConfigService();
const gameService = new GameService(configService);
const deckService = new AshesDeckService(configService);

module.exports.init = function (server) {
    server.get(
        '/api/games',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let games = await gameService.findByUserName(req.user.username, {});
            res.send({ success: true, games: games });
        })
    );

    server.get(
        '/api/games/:tag',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let games = await gameService.getTaggedGames(req.params.tag);
            const results = await Promise.all(
                games.map(async (game) => {
                    const gameResult = await getGameResult(game);
                    return gameResult;
                })
            );

            res.send({ success: true, results: results });
        })
    );
};

async function getPlayer(game, index) {
    const player = game.players[index];
    if (player.deckid) {
        const deck = await deckService.getById(player.deckid);
        const deckAudit = deck
            ? {
                deckId: player.deckid,
                ashesLiveModified: deck.ashesLiveModified,
                created: deck.created,
                lastUpdated: deck.lastUpdated,
                checkMe: deck.lastUpdated > deck.created
            } : null;

        player.deckAudit = deckAudit;
    }
    return player;
}

async function getGameResult(game) {

    const p1 = await getPlayer(game, 0);
    const p2 = await getPlayer(game, 1);
    const result = {
        label: game.label,
        id: game.id,
        startedAt: game.startedAt.toUTCString(),
        winner: game.winner,

        p1: p1,
        p2: p2
    };
    // console.log("gameResult: ", result);
    return result;
}
