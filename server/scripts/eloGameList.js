const GameService = require('../services/AshesGameService.js');
const ConfigService = require('../services/ConfigService.js');

const configService = new ConfigService();
let gameService = new GameService(configService);
let start = new Date('2018-08-26T13:00:00');
let end = new Date();
console.log('Games between', start, 'and', end);
let args = process.argv.slice(2);

gameService
    .getAllGames(start, end)
    .then(async (games) => {
        games.sort((a, b) => a.finishedAt < b.finishedAt);
        console.log('game | p1 | p2 | winner');
        for (const game of games) {
            if (game.winner && (game.gameType === 'competitive' || args[0] === 'all')) {
                console.log(
                    '%s | %s | %s | %s | %s',
                    game.gameId,
                    game.finishedAt,
                    game.players[0].name,
                    game.players[1].name,
                    game.winner
                );
            }
        }
    })
    .catch((error) => {
        console.log(error);
    });
