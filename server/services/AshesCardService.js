const _ = require('underscore');
const monk = require('monk');

const logger = require('../log.js');

class AshesCardService {
    constructor(configService, db) {
        if (!db) {
            const mongoUrl = process.env.MONGO_URL || configService.getValue('mongo');
            db = monk(mongoUrl);
        }

        this.cards = db.get('cards');
        this.packs = db.get('packs');
    }

    replaceCards(cards) {
        return this.cards.remove({}).then(() => this.cards.insert(cards));
    }

    replacePacks(cards) {
        return this.packs.remove({}).then(() => this.packs.insert(cards));
    }

    getAllCards(options) {
        return this.cards
            .find({})
            .then((result) => {
                let cards = {};

                _.each(result, (card) => {
                    if (options && options.shortForm) {
                        cards[card.stub] = {
                            _id: card._id,
                            name: card.name,
                            type: card.type,
                            stub: card.stub,
                            id: card.stub,
                            conjurations: card.conjurations,
                            phoenixborn: card.phoenixborn
                        };
                    } else {
                        cards[card.stub] = card;
                    }
                });

                return cards;
            })
            .catch((err) => {
                logger.info(err);
            });
    }

    getAllPacks() {
        return this.packs.find({}).catch((err) => {
            logger.info(err);
        });
    }
}

module.exports = AshesCardService;
