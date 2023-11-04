const moment = require('moment');
const _ = require('underscore');

const GameService = require('./services/AshesGameService.js');
const ConfigService = require('./services/ConfigService.js');

let gameService = new GameService(new ConfigService());


let start = new Date('2022-01-01T00:00:01');
let end = new Date();

let args = process.argv.slice(2);
if (args.length === 2) {
    start = new Date(args[0]);
    end = new Date(args[1]);
}
//console.info('Running stats between', args[0], 'and', args[1]);
console.info('Running stats between', start, 'and', end);

gameService
    .getAllGames(start, end)
    .then((games) => {
        let rejected = { singlePlayer: 0, noWinner: 0 };

        console.info('' + _.size(games), 'total games');

        const players = {};
        const decks = {};
        const playersByMonth = {};
        const weekCount = [];
        const monthCount = [];

        _.each(games, (game) => {
            if (_.size(game.players) !== 2) {
                rejected.singlePlayer++;

                return;
            }

            if (!game.winner) {
                rejected.noWinner++;

                return;
            }

            const startDateTime = moment(game.startedAt);
            const week = startDateTime.week();
            const month = startDateTime.month();
            weekCount[week] = weekCount[week] ? weekCount[week] + 1 : 1;
            if (!monthCount[month]) {
                monthCount[month] = { month: month, count: 0, solo: 0 };
            }
            if (game.solo) {
                monthCount[month].solo += 1;
            } else {
                monthCount[month].count += 1;
            }

            if (!playersByMonth[month]) {
                playersByMonth[month] = {};
            }

            _.each(game.players, (player) => {
                if (!players[player.name]) {
                    players[player.name] = { name: player.name, wins: 0, losses: 0 };
                }
                if (!playersByMonth[month][player.name]) {
                    playersByMonth[month][player.name] = { name: player.name, wins: 0, losses: 0 };
                }

                if (!decks[player.deck]) {
                    decks[player.deck] = { name: player.deck, wins: 0, losses: 0 };
                }

                var playerStat = players[player.name];
                var playerMonthStat = playersByMonth[month][player.name];
                var deckStat = decks[player.deck];

                if (player.name === game.winner) {
                    playerStat.wins++;
                    playerMonthStat.wins++;
                    deckStat.wins++;
                } else {
                    playerStat.losses++;
                    playerMonthStat.losses++;
                    deckStat.losses++;
                }
            });
        });

        console.info('\n### Game count by week \n\nWeek | Count');
        for (var key in weekCount) {
            console.info(key, ' | ', weekCount[key]);
        }

        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        console.info('\n### Game count by month \n\nMonth | PvP | Solo');
        for (const m in monthCount) {
            console.info(monthNames[m], ' | ', monthCount[m].count, ' | ', monthCount[m].solo);
        }

        console.info(rejected);

        console.info('\n### Players by Month\n\nMonth | players');

        _.each(Object.keys(playersByMonth), (month) => {
            console.info(monthNames[month] + ' | ' + Object.keys(playersByMonth[month]).length);
        });
    })
    .catch((error) => {
        console.log(error);
    });
