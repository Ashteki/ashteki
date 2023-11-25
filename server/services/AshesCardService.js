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
        this.alts = db.get('altarts');
        this.packs = db.get('packs');
    }

    replaceCards(cards) {
        return this.cards.remove({}).then(() => this.cards.insert(cards));
    }

    replaceAlts(alts) {
        return this.alts.remove({}).then(() => this.alts.insert(alts));
    }

    replacePacks(cards) {
        return this.packs.remove({}).then(() => this.packs.insert(cards));
    }

    getAltArts() {
        return this.alts
            .find({})
            .then((results) => {
                return results;
            })
            .catch((err) => {
                logger.info(err);
            });
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
                            imageStub: card.imageStub ? card.imageStub : card.stub,
                            id: card.stub,
                            conjurations: card.conjurations,
                            phoenixborn: card.phoenixborn,
                            copies: card.copies,
                            deckType: card.deckType
                        };
                    } else {
                        cards[card.stub] = card;
                    }
                });
                const chains = this.getChainedList();
                chains.forEach((c) => {
                    cards[c].isChained = true;
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

    getChainedList() {
        return [
            'explosive-growth',
            'exhortation',
            'massive-growth',
            'psychic-vampire',
            'river-skald',
            'summon-shining-hydra',
            // 'three-eyed-owl',
            'summon-sleeping-widows',
            'meteor'
        ];
    }
}

module.exports = AshesCardService;
