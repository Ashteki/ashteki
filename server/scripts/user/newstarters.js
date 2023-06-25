const _ = require('underscore');
const UserService = require('../../services/AshesUserService.js');
const ConfigService = require('../../services/ConfigService.js');
const GameService = require('../../services/AshesGameService.js');

const configService = new ConfigService();
let start = new Date('2018-08-26T13:00:00');
let end = new Date();
const gameService = new GameService(configService);

gameService.getAllGames(start, end).then((games) => {
    const userGameCount = games.reduce(function (agg, game) {
        if (game.players.length < 2) {
            console.log('exiting');
            return agg;
        }
        const p1Name = game.players[0].name;
        const p2Name = game.players[1].name;

        agg[p1Name] = agg[p1Name] || 0;
        agg[p2Name] = agg[p2Name] || 0;

        agg[p1Name]++;
        agg[p2Name]++;
        return agg;
    }, {});

    const starterList = {};

    let userService = new UserService(configService);
    userService
        .getAllUsers()
        .then((users) => {
            console.info('' + _.size(users), 'total users');

            _.each(users, (user) => {
                const joinMonth =
                    user.registered.getFullYear() +
                    '-' +
                    ('0' + (user.registered.getMonth() + 1)).slice(-2);

                if (!starterList[joinMonth]) {
                    starterList[joinMonth] = [];
                }
                starterList[joinMonth].push({
                    username: user.username,
                    count: userGameCount[user.username] || 0
                });
            });

            for (let j in starterList) {
                const starterCount = starterList[j].length;
                const starterCountOneGame = starterList[j].filter((s) => s.count > 0).length;
                const starterCountTwoGame = starterList[j].filter((s) => s.count > 1).length;
                console.log(
                    `${j} | ${starterCount} | ${starterCountOneGame} | ${starterCountTwoGame}`
                );
            }
            console.info('' + _.size(users), 'total users');
        })
        .catch((error) => {
            console.log(error);
        });
});