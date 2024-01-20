/*eslint no-console:0 */
const monk = require('monk');
const fs = require('fs');
const dataDirectory = 'data/decks/';

const CardService = require('../services/AshesCardService');
const DeckService = require('../services/AshesDeckService');
const ConfigService = require('../services/ConfigService');

let db = monk('mongodb://127.0.0.1:27017/ashteki');

class ImportPrecons {
    constructor() {
        const configService = new ConfigService();
        this.cardService = new CardService(configService);
        this.deckService = new DeckService(configService);
    }

    async import() {
        try {
            this.cards = await this.cardService.getAllCards();

            for (let deck of this.loadDecks()) {
                deck.preconGroup = 1;
                let existingDeck = await this.deckService.getPreconDeckById(deck.precon_id);
                if (!existingDeck) {
                    console.log('Importing', deck.name);
                    await this.deckService.createPrecon(deck);
                }
            }

            console.log('Done importing precon decks');
            console.log('----------');

            for (let deck of this.loadAPDecks()) {
                deck.preconGroup = 2;

                let existingDeck = await this.deckService.getPreconDeckById(deck.precon_id);
                if (!existingDeck) {
                    console.log('Importing', deck.name);
                    await this.deckService.createPrecon(deck);
                }
            }

            console.log('Done importing AP decks');
            console.log('----------');

            for (let deck of this.loadBBDecks()) {
                deck.preconGroup = 3;

                let existingDeck = await this.deckService.getPreconDeckById(deck.precon_id);
                if (!existingDeck) {
                    console.log('Importing', deck.name);
                    await this.deckService.createPrecon(deck);
                }
            }

            console.log('Done importing BB decks');
            console.log('----------');

            for (let deck of this.loadFADecks()) {
                deck.preconGroup = 4;

                let existingDeck = await this.deckService.getPreconDeckById(deck.precon_id);
                if (!existingDeck) {
                    console.log('Importing', deck.name);
                    await this.deckService.createPrecon(deck);
                }
            }

            console.log('Done importing FA decks');
            console.log('----------');

            for (let deck of this.loadChimeraDecks()) {
                deck.preconGroup = 5;

                let existingDeck = await this.deckService.getPreconDeckById(deck.precon_id);
                if (!existingDeck) {
                    console.log('Importing', deck.name);
                    await this.deckService.createPrecon(deck);
                }
            }

            console.log('Done importing Chimera decks');
            console.log('----------');

            for (let deck of this.loadPvEDecks()) {
                deck.preconGroup = 6;
                let existingDeck = await this.deckService.getPreconDeckById(deck.precon_id);
                if (!existingDeck) {
                    console.log('Importing', deck.name);
                    await this.deckService.createPrecon(deck);
                }
            }

            console.log('Done importing pvE precon decks');
            console.log('----------');

            for (let deck of this.loadMSUDecks()) {
                deck.preconGroup = 7;
                let existingDeck = await this.deckService.getPreconDeckById(deck.precon_id);
                if (!existingDeck) {
                    console.log('Importing', deck.name);
                    await this.deckService.createPrecon(deck);
                }
            }

            console.log('Done importing MSU precon decks');
            console.log('----------');
        } catch (err) {
            console.error('Could not finish import', err);
        }
    }

    loadDecks() {
        let file = 'precon-core.json';
        let data = fs.readFileSync(dataDirectory + file);
        return JSON.parse(data);
    }

    loadPvEDecks() {
        let file = 'precon-pve.json';
        let data = fs.readFileSync(dataDirectory + file);
        return JSON.parse(data);
    }

    loadAPDecks() {
        let file = 'precon-aparty.json';
        let data = fs.readFileSync(dataDirectory + file);
        return JSON.parse(data);
    }

    loadFADecks() {
        let file = 'first-adventure.json';
        let data = fs.readFileSync(dataDirectory + file);
        return JSON.parse(data);
    }

    loadBBDecks() {
        let file = 'building-basics.json';
        let data = fs.readFileSync(dataDirectory + file);
        return JSON.parse(data);
    }

    loadChimeraDecks() {
        let file = 'chimera.json';
        let data = fs.readFileSync(dataDirectory + file);
        return JSON.parse(data);
    }

    loadMSUDecks() {
        let file = 'master-set-upgrade.json';
        let data = fs.readFileSync(dataDirectory + file);
        return JSON.parse(data);
    }

    clearPrecons() {
        this.deckService.clearPrecons();
    }
}

let importer = new ImportPrecons();
Promise.all([importer.clearPrecons(), importer.import()])
    .then(() => db.close())
    .catch(() => db.close());
