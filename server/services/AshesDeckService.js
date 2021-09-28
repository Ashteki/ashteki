const logger = require('../log.js');
const monk = require('monk');
const util = require('../util.js');

class AshesDeckService {
    constructor(configService, db) {
        if (!db) {
            const mongoUrl = process.env.MONGO_URL || configService.getValue('mongo');
            db = monk(mongoUrl);
        }

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
        return this.preconDecks.find({}, { sort: { precon_id: 1 } });
    }

    async findByUserName(userName, options, applyLimit = true) {
        let nameSearch = '';
        let limit = 0;
        let skip = 0;
        if (options && applyLimit) {
            limit = options.pageSize * 1;
            skip = limit * (options.page - 1);
        }
        if (options && options.filter) {
            for (let filterObject of options.filter || []) {
                if (filterObject.name === 'name') {
                    nameSearch = filterObject.value;
                }
            }
        }
        const searchFields = { username: userName };
        if (nameSearch !== '') {
            searchFields.name = { $regex: nameSearch, $options: 'i' };
        }
        return await this.decks.find(searchFields, {
            sort: { lastUpdated: -1 },
            skip: skip,
            limit: limit
        });
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

    async import(user, deck) {
        let deckResponse;

        try {
            let response = await util.httpRequest(
                `https://api.ashes.live/v2/decks/shared/${deck.uuid}`
            );

            if (response[0] === '<') {
                logger.error('Deck failed to import: %s %s', deck.uuid, response);

                throw new Error('Invalid response from api. Please try again later.');
            }

            deckResponse = JSON.parse(response);
        } catch (error) {
            logger.error(`Unable to import deck ${deck.uuid}`, error);

            throw new Error('Invalid response from Api. Please try again later.');
        }

        if (!deckResponse || !deckResponse.cards) {
            throw new Error('Invalid response from Api. Please try again later.');
        }

        let newDeck = this.parseAshesLiveDeckResponse(user, deckResponse);

        let response = await this.create(newDeck);

        return this.getById(response._id);
    }

    parseAshesLiveDeckResponse(user, ashesDeck) {
        return {
            username: user.username,
            name: ashesDeck.title,
            phoenixborn: [
                {
                    id: ashesDeck.phoenixborn.stub,
                    count: 1
                }
            ],
            dicepool: ashesDeck.dice.map((d) => ({ magic: d.name, count: d.count })),
            cards: ashesDeck.cards.map((c) => ({ id: c.stub, count: c.count })),
            conjurations: ashesDeck.conjurations.map((c) => ({ id: c.stub, count: c.count }))
        };
    }

    getDeckProperties(deck, isPrecon) {
        let properties = {
            name: deck.deckName || deck.name,
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

    async getNumDecksForUser(user, options) {
        const userDecks = await this.findByUserName(user.username, options, false);
        //todo: handle options
        return userDecks ? userDecks.length : 0;
    }
}

module.exports = AshesDeckService;
