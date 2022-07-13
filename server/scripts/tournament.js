const AshesDeckService = require('../services/AshesDeckService.js');
const GameService = require('../services/AshesGameService.js');
const ConfigService = require('../services/ConfigService.js');

let gameService = new GameService(new ConfigService());
let deckService = new AshesDeckService(new ConfigService());
let args = process.argv.slice(2);
if (!args.length) {
    process.exit();
}
let label = args[0];
console.log('label:', label);

console.info('Games matching label:', label);
let start = new Date('2022-01-01T00:00:01');
let end = new Date();

async function doIt(label) {
    let games = await gameService.getTaggedGames(label);
    // games = games.filter((g) => g.label === label);
    console.log('count: ', games.length);
    const results = await Promise.all(games.map(async (game) => await getGameResult(game)));

    results.forEach((r) => {
        console.log(r);
    })
}

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

        // console.log(deckAudit);
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
        winner: game.winner,

        p1: p1,
        p2: p2
    };
    // console.log("gameResult: ", result);
    return result;

}

doIt(label).then(() => {
    process.exit();
});
