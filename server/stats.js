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
        let rejected = { singlePlayer: 0, noWinner: 0, mirror: 0 };

        console.info('' + _.size(games), 'total games');

        let players = {};
        let decks = {};
        let playersByMonth = {};
        let weekCount = [];
        let monthCount = [];
        let fpWinRates = { first: 0, second: 0 };

        _.each(games, (game) => {
            if (_.size(game.players) !== 2) {
                rejected.singlePlayer++;

                return;
            }

            if (!game.winner) {
                rejected.noWinner++;

                return;
            } else if (game.players[0].deck === game.players[1].deck) {
                rejected.mirror++;
                // return;
            }

            if (
                (game.players[0].turns === game.players[1].turns) ===
                (game.winner === game.players[0].name)
            ) {
                fpWinRates.first++;
            } else {
                fpWinRates.second++;
            }

            const startDateTime = moment(game.startedAt);
            const week = startDateTime.week();
            const month = startDateTime.month();
            weekCount[week] = weekCount[week] ? weekCount[week] + 1 : 1;
            monthCount[month] = monthCount[month] ? monthCount[month] + 1 : 1;
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

        let topPlayers = _.chain(players)
            .sortBy((player) => {
                return -(player.wins + player.losses);
            })
            .first(20)
            .value();

        let winners = _.chain(players)
            .sortBy((player) => {
                return -player.wins;
            })
            .first(10)
            .value();

        let winRates = _.map(winners, (player) => {
            let games = player.wins + player.losses;

            return {
                name: player.name,
                wins: player.wins,
                losses: player.losses,
                winRate: Math.round((player.wins / games) * 100)
            };
        });

        let winRateStats = _.chain(winRates)
            .sortBy((player) => {
                return -player.winRate;
            })
            .first(10)
            .value();

        let deckWinRates = _.map(decks, (deck) => {
            let games = deck.wins + deck.losses;

            return {
                name: deck.name,
                wins: deck.wins,
                losses: deck.losses,
                winRate: Math.round((deck.wins / games) * 100)
            };
        });

        let deckWinRateStats = _.sortBy(deckWinRates, (deck) => {
            return -deck.winRate;
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
        console.info('\n### Game count by month \n\nMonth | Count');
        for (const m in monthCount) {
            console.info(monthNames[m], ' | ', monthCount[m]);
        }

        console.info('\n### Top 10 Players\n\nName | Number of games\n-----|----------------');

        _.each(topPlayers, (p) => {
            console.info(p.name, ' | ', p.wins + p.losses);
        });

        console.info('\n### Top 10\n\nName | Number of wins\n-----|----------------');

        _.each(winners, (winner) => {
            console.info(winner.name, ' | ', winner.wins);
        });

        console.info(
            '\n### Top 10 by winrate\n\nName | Number of wins | Number of losses | Win Rate\n-----|----------------|------------------|----------'
        );

        _.each(winRateStats, (winner) => {
            console.info(
                winner.name,
                ' | ',
                winner.wins,
                ' | ',
                winner.losses,
                ' | ',
                winner.winRate + '%'
            );
        });

        console.info(
            '\n### Deck win rates\n\nDeck | Number of wins | Number of losses | Win Rate\n-----|----------------|------------------|----------'
        );

        _.each(deckWinRateStats, (winner) => {
            console.info(
                winner.name,
                ' | ',
                winner.wins,
                ' | ',
                winner.losses,
                ' | ',
                winner.winRate + '%'
            );
        });

        console.info(
            'First Player win rate:',
            Math.round((fpWinRates.first / (fpWinRates.first + fpWinRates.second)) * 100) + '%'
        );

        console.info(rejected);

        console.info('\n### Players by Month\n\nMonth | players');

        _.each(Object.keys(playersByMonth), (month) => {
            console.info(monthNames[month] + ' | ' + Object.keys(playersByMonth[month]).length);
        });
    })
    .catch((error) => {
        console.log(error);
    });
