const moment = require('moment');
const _ = require('underscore');

const GameService = require('../services/AshesGameService.js');
const ConfigService = require('../services/ConfigService.js');

let gameService = new GameService(new ConfigService());


let start = new Date('2024-01-01T00:00:01');
let end = new Date();

let args = process.argv.slice(2);
if (args.length === 2) {
    start = new Date(args[0]);
    end = new Date(args[1]);
}
//console.info('Running stats between', args[0], 'and', args[1]);
console.info('Running gameformat stats between', start, 'and', end);

gameService
    .getAllGames(start, end)
    .then((games) => {
        let rejected = { singlePlayer: 0, noWinner: 0 };

        console.info('' + _.size(games), 'total games');

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
            const month = startDateTime.month();
            if (!monthCount[month]) {
                monthCount[month] = { month: month, count: 0, solo: 0, precon: 0, firstadventure: 0, aparty: 0, constructed: 0, coaloff: 0, hl2pvp: 0, onecollection: 0 };
            }

            if (game.solo) {
                monthCount[month].solo += 1;
            } else {
                // console.log(game.gameFormat);
                monthCount[month][game.gameFormat] += 1;
            }
        });

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
        console.info('\n### Game count by month \n\nMonth | constructed | Solo | precon | firstadventure | aparty | coaloff | hl2pvp | onecollection');
        for (const m in monthCount) {
            // console.info(monthNames[m], ' | ', monthCount[m].count, ' | ', monthCount[m].solo);
            console.info(
                `${monthNames[m]} | ${monthCount[m].constructed} | ${monthCount[m].solo} | ${monthCount[m].precon} | ${monthCount[m].firstadventure} | ${monthCount[m].aparty} | ${monthCount[m].coaloff} | ${monthCount[m].hl2pvp} | ${monthCount[m].onecollection}`
            );
        }

        console.info(rejected);
    })
    .catch((error) => {
        console.log(error);
    });
