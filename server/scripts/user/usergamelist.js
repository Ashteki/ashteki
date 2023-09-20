const _ = require('underscore');
const GameService = require('../../services/AshesGameService.js');
const ConfigService = require('../../services/ConfigService.js');

let gameService = new GameService(new ConfigService());

const username = process.argv[2];
if (!username) {
    process.exit();
}
console.info('Games for ', username);

gameService
    .findByUserName(username, { includeNonWins: true })
    .then((games) => {
        games.sort((a, b) => a.startedAt > b.startedAt ? 1 : -1)
        console.info('' + _.size(games), 'total games');

        _.each(games, (game) => {
            console.info(game);
        });

        console.info('' + _.size(games), 'total games');
    })
    .catch((error) => {
        console.log(error);
    });
