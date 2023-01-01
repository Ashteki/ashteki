const GameService = require('../../services/AshesGameService.js');
const ConfigService = require('../../services/ConfigService.js');

const configService = new ConfigService();
let gameService = new GameService(configService);
let start = new Date('2018-08-26T13:00:00');
let end = new Date();
console.log('Games between', start, 'and', end);
let args = process.argv.slice(2);

gameService
    .getAllGames(start, end)
    .then(async (games) => {
        games.sort((a, b) => a.startedAt < b.startedAt);
        console.log('datetime | dayofweek | time');
        for (const game of games) {
            if (game.startedAt) {
                try {
                    console.log(
                        '%s | %s | %s | %s',
                        game.startedAt,
                        game.startedAt.getDay(),
                        game.startedAt.getTime()
                    );
                }
                catch (e) {

                }
            }
        }
    })
    .catch((error) => {
        console.log(error);
    });
