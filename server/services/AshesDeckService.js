const logger = require('../log.js');
const monk = require('monk');

class AshesDeckService {
    constructor(configService) {
        let db = monk(configService.getValue('mongo'));
        this.decks = db.get('decks');
        this.preconDecks = db.get('precon_decks');
    }

    getById(id) {
        return this.decks.findOne({ _id: id }).catch((err) => {
            logger.error('Unable to fetch deck', err);
            throw new Error('Unable to fetch deck ' + id);
        });
    }

    getPreconDeckById(id) {
        return this.preconDecks.findOne({ _id: id }).catch((err) => {
            logger.error('Unable to fetch precon deck', err);
            throw new Error('Unable to fetch precon deck ' + id);
        });
    }

    getPreconDecks() {
        return this.preconDecks.find();
    }

    async findByUserName(userName) {
        return await this.decks.find({ username: userName }, { sort: { lastUpdated: -1 } });
    }

    clearPrecons() {
        return this.preconDecks.remove({});
    }

    createPrecon(deck) {
        let properties = this.getDeckProperties(deck, true);

        return this.preconDecks.insert(properties);
    }

    create(deck) {
        let properties = this.getDeckProperties(deck);

        return this.decks.insert(properties);
    }

    getDeckProperties(deck, isPrecon) {
        let properties = {
            username: deck.username,
            name: deck.deckName,
            phoenixborn: deck.phoenixborn,
            dicepool: deck.dicepool,
            cards: deck.cards,
            conjurations: deck.conjurations,
            lastUpdated: new Date()
        };
        if (isPrecon) {
            properties = Object.assign(properties, { precon_id: deck.precon_id });
        } else {
            properties = Object.assign(properties, { username: deck.username });
        }
        return properties;
    }

    update(deck) {
        let properties = {
            name: deck.deckName,
            phoenixborn: deck.phoenixborn,
            dicepool: deck.dicepool,
            cards: deck.cards,
            conjurations: deck.conjurations,
            lastUpdated: new Date()
        };

        return this.decks.update({ _id: deck.id }, { $set: properties });
    }

    delete(id) {
        return this.decks.remove({ _id: id });
    }

    async getNumDecksForUser(user) {
        const userDecks = await this.findByUserName(user.username);
        //todo: handle options
        return userDecks ? userDecks.length : 0;
    }
}

module.exports = AshesDeckService;
