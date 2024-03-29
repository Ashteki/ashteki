const logger = require('../log.js');
const GameService = require('../services/AshesGameService.js');
const UserService = require('../services/AshesUserService.js');
const ConfigService = require('../services/ConfigService.js');

const configService = new ConfigService();
let gameService = new GameService(configService);
const userService = new UserService(configService);
let start = new Date('2018-08-26T13:00:00');
let end = new Date();
console.info('Games between', start, 'and', end);
let args = process.argv.slice(2);

gameService
    .getAllGames(start, end)
    .then(async (games) => {
        games.sort((a, b) => a.finishedAt < b.finishedAt);

        console.info(games.length, 'total games');
        for (const game of games) {
            if (game.winner && (game.gameType === 'competitive' || args[0] === 'all')) {
                logger.info('game: %s winner: %s', game.gameId, game.winner);

                await userService.recordRankedResult(game.players, game.winner, game.finishedAt);
            }
        }
    })
    .catch((error) => {
        console.log(error);
    });
