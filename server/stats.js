const _ = require('underscore');
const GameService = require('./services/AshesGameService.js');
const ConfigService = require('./services/ConfigService.js');

const bannedDecks = [
    'flaregas-spawn-of-conflascoot',
    'thomsen-of-trinitop',
    'khyrmn-hierophant-of-the-nihilistic-haunt'
];

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
console.info('Running stats between', start, 'and', end);

gameService
    .getAllGames(start, end)
    .then((games) => {
        let rejected = { singlePlayer: 0, noWinner: 0, banned: 0, mirror: 0 };

        console.info('' + _.size(games), 'total games');

        let players = {};
        let decks = {};
        let fpWinRates = { first: 0, second: 0 };

        _.each(games, (game) => {
            if (_.size(game.players) !== 2) {
                rejected.singlePlayer++;

                return;
            }

            if (!game.winner) {
                rejected.noWinner++;

                return;
            } else if (game.players.some((player) => bannedDecks.includes(player.deck))) {
                rejected.banned++;
                return;
            } else if (game.players[0].deck === game.players[1].deck) {
                rejected.mirror++;
                return;
            }

            if (
                (game.players[0].turns === game.players[1].turns) ===
                (game.winner === game.players[0].name)
            ) {
                fpWinRates.first++;
            } else {
                fpWinRates.second++;
            }

            _.each(game.players, (player) => {
                if (!players[player.name]) {
                    players[player.name] = { name: player.name, wins: 0, losses: 0 };
                }

                if (!decks[player.deck]) {
                    decks[player.deck] = { name: player.deck, wins: 0, losses: 0 };
                }

                var playerStat = players[player.name];
                var deckStat = decks[player.deck];

                if (player.name === game.winner) {
                    playerStat.wins++;
                    deckStat.wins++;
                } else {
                    playerStat.losses++;
                    deckStat.losses++;
                }
            });
        });

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

        console.info('### Top 10\n\nName | Number of wins\n----|----------------');

        _.each(winners, (winner) => {
            console.info(winner.name, ' | ', winner.wins);
        });

        console.info(
            '### Top 10 by winrate\n\nName | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------'
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
            '### Deck win rates\n\nDeck | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------'
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
    })
    .catch((error) => {
        console.log(error);
    });
