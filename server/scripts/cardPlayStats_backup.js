const fs = require('fs');
const _ = require('underscore');
const GameService = require('../services/AshesGameService.js');
const ConfigService = require('../services/ConfigService.js');

let gameService = new GameService(new ConfigService());

let args = process.argv.slice(2);
let start = null;
let end = null;
let includeSolo = false;
let ranked = false;

for (let i = 0; i < args.length; i++) {
    if (args[i] === '-solo') {
        includeSolo = true;
    } else if (args[i] === '-ranked') {
        ranked = true;
    } else if (!start) {
        start = new Date(args[i]);
        if (isNaN(start.getTime())) {
            console.error('Invalid start date provided. Use ISO dates like 2024-01-01');
            process.exit(1);
        }
    } else if (!end) {
        end = new Date(args[i]);
        if (isNaN(end.getTime())) {
            console.error('Invalid end date provided. Use ISO dates like 2024-12-31');
            process.exit(1);
        }
    } else {
        console.error('Too many arguments. Usage: node cardPlayStats.js [start_date] [end_date] [-solo] [-ranked]');
        process.exit(1);
    }
}

let findSpec = {
    winner: { $exists: true },
    winReason: { $ne: 'Agreement' },
    chat: { $exists: true, $ne: '' }
};
if (!includeSolo) {
    findSpec.solo = { $ne: true };
}
if (ranked) {
    findSpec.gameType = 'competitive';
}
if (start && end) {
    findSpec.finishedAt = { $gte: start, $lt: end };
}

console.info('Generating card play statistics...', start && end ? `from ${start.toISOString()} to ${end.toISOString()}` : 'for all dates', includeSolo ? '(including solo games)' : '(excluding solo games)', ranked ? '(ranked games only)' : '(all game types)');

gameService.games
    .find(findSpec)
    .then((games) => {
        const totalGameCount = _.size(games);
        console.info('Total games returned from query:', totalGameCount);

        let cardStats = {};

        _.each(games, (game) => {
            if (!game.winner || game.winReason === 'Agreement' || !game.chat || game.chat === '') {
                return;
            }

            let players = game.players.map(p => p.name);
            let isSolo = game.solo || players.length !== 2;
            if (!includeSolo && isSolo) {
                return; // Skip solo games if not including
            }

            let winner = game.winner;
            let loser = isSolo ? null : players.find(p => p !== winner);

            let chat = game.chat;
            // Regex to find all "player plays card" patterns
            let playRegex = /(?:^|: )([^\s]+) plays ([^\n\r]+)/gm;
            let match;
            while ((match = playRegex.exec(chat)) !== null) {
                let playerName = match[1];
                let cardName = match[2].trim();
                cardName = cardName.replace(/\s+(?:attaching it to|to|and)[\s\S]*$/i, '').trim();

                if (!cardStats[cardName]) {
                    cardStats[cardName] = { totalGames: 0, winnerPlays: 0, loserPlays: 0 };
                }

                cardStats[cardName].totalGames++;
                if (playerName === winner) {
                    cardStats[cardName].winnerPlays++;
                } else if (loser && playerName === loser) {
                    cardStats[cardName].loserPlays++;
                }
            }
        });

        // Generate CSV
        let csv = 'Card Name,Total Games,Winner Plays,Loser Plays,Win %\n';
        _.each(cardStats, (stats, cardName) => {
            const winPercent = stats.totalGames > 0 ? Math.round((stats.winnerPlays / stats.totalGames) * 100) : 0;
            csv += `"${cardName.replace(/"/g, '""')}",${stats.totalGames},${stats.winnerPlays},${stats.loserPlays},${winPercent}\n`;
        });

        fs.writeFileSync('card_play_stats.csv', csv);
        console.info('CSV report generated: card_play_stats.csv');
        console.info('Total unique cards:', _.size(cardStats));
    })
    .catch((error) => {
        console.error('Error generating stats:', error);
    });