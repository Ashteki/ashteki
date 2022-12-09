
const DeckService = require('../../services/AshesDeckService.js');
const GameService = require('../../services/AshesGameService.js');
const ConfigService = require('../../services/ConfigService.js');

let deckService = new DeckService(new ConfigService());
let gameService = new GameService(new ConfigService());

async function getDecks(username) {
    let numDecks = await deckService.getNumDecksForUser(username, {});
    let decks = [];

    if (numDecks > 0) {
        const rawDecks = await deckService.findByUserName(username, {});
        decks = rawDecks.map((deck) => {
            deck.played = 0;
            deck.wins = 0;
            deck.winRate = 0;
            deck.pb = deck.phoenixborn[0].id;
            return deck;
        });

        await gameService
            .findByUserName(username, {
                excludeNonWins: true
            })
            .then((games) => {
                games.forEach((game) => {
                    const player = game.players.find(p => p.name === username);
                    if (player && player.deckid) {
                        const deck = decks.find((d) => d._id.toString() === player.deckid);
                        if (deck) {
                            deck.played++;
                            if (game.winner === username) {
                                deck.wins++;
                            }
                            deck.winRate = Math.round(deck.wins / deck.played * 100);
                        }
                    }
                });

                console.log(decks);

                console.log('games', games.length);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

(async () => {
    await getDecks('dijon');
})();
