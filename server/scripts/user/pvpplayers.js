const ConfigService = require('../../services/ConfigService.js');
const GameService = require('../../services/AshesGameService.js');

const configService = new ConfigService();
let start = new Date('2018-08-26T13:00:00');
let end = new Date();
const gameService = new GameService(configService);

gameService
    .getAllGames(start, end)
    .then((games) => {
        // counting pvp players so pvp games only
        const soloPlayers = games.filter(g => g.gameFormat !== 'solo').reduce(function (agg, game) {
            if (game.players.length < 2) {
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
        console.log(soloPlayers);

        const pvpCount = Object.values(soloPlayers).length;
        console.log('PvP players: ' + pvpCount);
    })
    .catch((error) => {
        console.log('Error' + error);
    });