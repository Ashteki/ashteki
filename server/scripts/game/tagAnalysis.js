const GameService = require('../../services/AshesGameService.js');
const ConfigService = require('../../services/ConfigService.js');

const configService = new ConfigService();
let gameService = new GameService(configService);
let args = process.argv.slice(2);
const inputTag = args[0];

gameService
    .getTaggedGames(inputTag, {})
    .then(async (games) => {
        const pbStats = {};
        const rejects = { mirror: 0, nowin: 0 };

        for (const game of games) {
            if (game.players[0].deck === game.players[1].deck) {
                rejects.mirror++;
                continue;
            }
            if (!game.winner) {
                rejects.nowin++;
                continue;
            }

            if (!pbStats[game.players[0].deck]) {
                pbStats[game.players[0].deck] = { wins: 0, losses: 0 };
            }
            if (!pbStats[game.players[1].deck]) {
                pbStats[game.players[1].deck] = { wins: 0, losses: 0 };
            }

            if (game.winner === game.players[0].name) {
                pbStats[game.players[0].deck].wins++;
                pbStats[game.players[1].deck].losses++;
            }

            if (game.winner === game.players[1].name) {
                pbStats[game.players[1].deck].wins++;
                pbStats[game.players[0].deck].losses++;
            }
        }

        console.log(`Mirrors: ${rejects.mirror}, NoWins: ${rejects.nowin}`);
        console.log('Pb | wins | losses');
        for (const [key, value] of Object.entries(pbStats)) {
            console.log(`${key}| ${value.wins}| ${value.losses}`);
        }

        process.exit();
    })
    .catch((error) => {
        console.log(error);
    });
