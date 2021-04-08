const _ = require('underscore');

const cards = require('./cards');
const Card = require('./Card.js');
const logger = require('../log.js');
const Die = require('./Die');
const { Level } = require('../constants');

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
            diceCounts: [],
            phenixborn: null,
            dice: []
        };

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

        this.eachRepeatedCard(this.data.phoenixborn, (pbData) => {
            let pbCard = this.createCard(player, pbData);
            if (pbCard) {
                pbCard.setupAbilities();
                pbCard.location = 'play area';

                result.phoenixborn = pbCard;
            }
        });

        this.data.dicepool.forEach((dc) => {
            for (let i = 0; i < dc.count; i++) {
                const die = new Die(player, dc.magic, Level.Basic);
                die.location = 'dicepool';
                die.setupAbilities();
                result.dice.push(die);
            }
        });

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
