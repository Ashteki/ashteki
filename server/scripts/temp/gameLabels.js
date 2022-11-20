const GameService = require('../../services/AshesGameService.js');
const ConfigService = require('../../services/ConfigService.js');

const configService = new ConfigService();
let gameService = new GameService(configService);
let start = new Date('2018-08-26T13:00:00');
let end = new Date();
console.log('Games between', start, 'and', end);
let args = process.argv.slice(2);

const gameLabels = [];

gameService
    .getAllGames(start, end)
    .then(async (games) => {
        games.sort((a, b) => a.finishedAt < b.finishedAt);
        console.log('game labels');
        for (const game of games) {
            if (game.label) {
                if (!gameLabels.includes(game.label)) {
                    gameLabels.push(game.label);
                }
            }
        }

        gameLabels.forEach((label) => console.log(label));
    })
    .catch((error) => {
        console.log(error);
    });
