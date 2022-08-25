const _ = require('underscore');
const GameService = require('../../services/AshesGameService.js');
const ConfigService = require('../../services/ConfigService.js');
const monk = require('monk');
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ashteki';

let db = monk(mongoUrl);
console.log('attached to: ' + mongoUrl);

let gameService = new GameService(new ConfigService());
/*
let args = process.argv.slice(2);

if(_.size(args) < 2) {
    console.error('Must provide start and end date');

    db.close();
    return;
}
*/

let start = new Date('2018-08-26T13:00:00');
let end = new Date();
//console.info('Running stats between', args[0], 'and', args[1]);
// console.info('Games between', start, 'and', end);

gameService.getAllGames(start, end).then((games) => {
    let players = {};
    _.each(games, (game) => {
        if (_.size(game.players) !== 2) {
            return;
        }

        _.each(game.players, (player) => {
            if (!players[player.name]) {
                players[player.name] = { name: player.name, played: 0 };
            }

            var playerStat = players[player.name];
            playerStat.played++;
        });
    });

    const collection = db.get('users');
    _.each(players, (player) => {
        console.log(player);
        collection
            .update(
                { username: player.name },
                {
                    $set: {
                        gamesPlayed: player.played
                    }
                }
            )
            .then(() => db.close());
    })

});
