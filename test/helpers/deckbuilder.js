const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const { matchCardByNameAndPack } = require('./cardutil.js');

const PathToSubModulePacks = path.join(__dirname, '../../data/cards');
const PathToPreconData = path.join(__dirname, '../../data/decks');

const defaultFiller = ['open-memories'];
const defaultDummyDeck = ['rampage', 'hunting-instincts'];

class DeckBuilder {
    constructor() {
        this.cardsByCode = this.loadCards(PathToSubModulePacks);
        this.cards = Object.values(this.cardsByCode);
        this.precons = this.loadPrecons(PathToPreconData);
    }

    loadCards(directory) {
        let cards = {};

        let jsonPacks = fs.readdirSync(directory).filter((file) => file.endsWith('.json'));

        for (let file of jsonPacks) {
            let pack = require(path.join(directory, file));

            for (let card of pack.results) {
                cards[card.stub] = card;
            }
        }

        return cards;
    }

    loadPrecons(directory) {
        let precons = [];

        let jsonPrecons = fs
            .readdirSync(directory)
            .filter((file) => file.endsWith('-core.json') || file.endsWith('-pve.json'));

        for (let file of jsonPrecons) {
            let pack = require(path.join(directory, file));

            for (let deck of pack) {
                precons.push(deck);
            }
        }

        return precons;
    }

    /*
        options: as player1 and player2 are described in setupTest #1514
    */
    customDeck(player = {}) {
        let deck = [];
        const minDeck = player.dummy ? 8 : 6;

        for (let zone of [
            'deck',
            'hand',
            'inPlay',
            'spellboard',
            'discard',
            'archives',
            'threatZone'
        ]) {
            if (Array.isArray(player[zone])) {
                deck = deck.concat(player[zone]);
            }
        }

        const filler = player.dummy ? defaultDummyDeck : defaultFiller[0];
        while (deck.length < minDeck) {
            deck = deck.concat(filler);
        }

        let dice = [
            {
                magic: 'illusion',
                count: 3
            },
            {
                magic: 'ceremonial',
                count: 2
            },
            {
                magic: 'charm',
                count: 3
            },
            {
                magic: 'natural',
                count: 2
            }
        ];

        return this.buildDeck(deck, player, dice);
    }

    buildDeck(cardLabels, player, dice) {
        var cardCounts = {};
        _.each(cardLabels, (label) => {
            var cardData = this.getCard(label);
            if (cardCounts[cardData.stub]) {
                cardCounts[cardData.stub].count++;
            } else {
                cardCounts[cardData.stub] = {
                    count: 1,
                    card: cardData,
                    id: cardData.stub
                };
            }
        });

        var pbData = this.getCard(player.phoenixborn);

        const result = {
            cards: Object.values(cardCounts),
            phoenixborn: [
                {
                    count: 1,
                    card: pbData,
                    id: pbData.stub
                }
            ],
            dicepool: dice
        };

        if (player.dummy) {
            var bData = this.getCard(player.behaviour);
            result.behaviour = [
                {
                    count: 1,
                    card: bData,
                    id: bData.stub
                }
            ];

            const uData = this.getCard(player.ultimate);
            result.ultimate = [
                {
                    count: 1,
                    card: uData,
                    id: uData.stub
                }
            ];
        }
        return result;
    }

    getCard(idOrLabelOrName) {
        if (this.cards[idOrLabelOrName]) {
            return this.cards[idOrLabelOrName];
        }

        var cardsByName = _.filter(this.cards, matchCardByNameAndPack(idOrLabelOrName));

        if (cardsByName.length === 0) {
            throw new Error(`Unable to find any card matching ${idOrLabelOrName}`);
        }

        if (cardsByName.length > 1) {
            var matchingLabels = _.map(
                cardsByName,
                (card) => `${card.name} (${card.pack_code})`
            ).join('\n');
            throw new Error(
                `Multiple cards match the name ${idOrLabelOrName}. Use one of these instead:\n${matchingLabels}`
            );
        }

        return cardsByName[0];
    }
}

module.exports = DeckBuilder;
