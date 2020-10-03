const _ = require('underscore');

const cards = require('./cards');
const Card = require('./Card.js');
const logger = require('../log.js');

class Deck {
    constructor(data) {
        if (!data) {
            return;
        }

        data.cards = data.cards.map((card) => {
            let result = {
                count: card.count,
                card: card.card
            };
            if (!result.card) {
                logger.error(`Corrupt card ${card.name}: ${card}`);
                return result;
            }

            if (card.maverick) {
                result.card.house = card.maverick;
                result.card.maverick = card.maverick;
            } else if (card.anomaly) {
                result.card.house = card.anomaly;
                result.card.anomaly = card.anomaly;
            }

            if (card.house) {
                result.card.house = card.house;
            }

            if (card.image) {
                result.card.cardImage = card.image;
            }

            return result;
        });

        this.data = data;
    }

    prepare(player) {
        var result = {
            conjurations: [],
            cards: [],
            diceCounts: []
        };

        result.houses = this.data.houses;

        this.eachRepeatedCard(this.data.cards, (cardData) => {
            let card = this.createCard(player, cardData);
            if (card) {
                card.setupAbilities();
                card.location = 'deck';
                result.cards.push(card);
            }
        });

        this.eachRepeatedCard(this.data.conjurations, (conjData) => {
            let card = this.createCard(player, conjData);
            if (card) {
                card.setupAbilities();
                card.location = 'archives';
                result.conjurations.push(card);
            }
        });

        result.diceCounts = this.data.dicepool;

        return result;
    }

    eachRepeatedCard(cards, func) {
        _.each(cards, (cardEntry) => {
            for (var i = 0; i < cardEntry.count; i++) {
                func(cardEntry.card);
            }
        });
    }

    createCard(player, cardData) {
        if (!cardData || !cardData.stub) {
            logger.error(`no cardData for ${JSON.stringify(cardData)}`);
            return;
        }

        if (!cards[cardData.stub]) {
            return new Card(player, cardData);
        }

        let cardClass = cards[cardData.stub];
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;
