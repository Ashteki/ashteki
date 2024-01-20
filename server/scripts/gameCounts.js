const _ = require('underscore');
const GameService = require('../services/AshesGameService.js');
const ConfigService = require('../services/ConfigService.js');

let gameService = new GameService(new ConfigService());

let start = new Date('2018-08-26T13:00:00');
let end = new Date();
//console.info('Running stats between', args[0], 'and', args[1]);
console.info('Games between', start, 'and', end);

gameService
    .getAllGames(start, end)
    .then((games) => {
        console.info('' + _.size(games), 'total games');

        let players = {};

        _.each(games, (game) => {
            // console.info(game);

            if (!game.winner || game.solo || !game.winReason || game.winReason === 'Agreement') {
                return;
            }

            _.each(game.players, (player) => {
                if (!players[player.name]) {
                    players[player.name] = { name: player.name, wins: 0, losses: 0 };
                }

                var playerStat = players[player.name];

                if (player.name === game.winner) {
                    playerStat.wins++;
                } else {
                    playerStat.losses++;
                }
            });
        });

        let winners = _.chain(players)
            .sortBy((player) => {
                return -(player.wins + player.losses);
            })
            .first(50)
            .value();

        console.info('Name | Number of games\n-----|----------------');

        _.each(winners, (winner) => {
            console.info(winner.name, ' | ', winner.wins);
        });

    })
    .catch((error) => {
        console.log(error);
    });
