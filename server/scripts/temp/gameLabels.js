const GameService = require('../../services/AshesGameService.js');
const ConfigService = require('../../services/ConfigService.js');

const configService = new ConfigService();
let gameService = new GameService(configService);
let start = new Date('2018-08-26T13:00:00');
let end = new Date();
console.log('Games between', start, 'and', end);
let args = process.argv.slice(2);

const gameLabels = {};

gameService
    .getAllGames(start, end)
    .then(async (games) => {
        games.sort((a, b) => a.finishedAt < b.finishedAt);
        console.log('game label | count');
        for (const game of games) {
            if (game.label && game.gameType === 'casual') {
                if (!gameLabels[game.label]) {
                    gameLabels[game.label] = 1;
                } else {
                    gameLabels[game.label]++;
                }
            }
        }

        for (const property in gameLabels) {
            console.log(`${property}|${gameLabels[property]}`);
        }
    })
    .catch((error) => {
        console.log(error);
    });
