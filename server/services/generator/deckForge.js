const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const ExtrasFactory = require('./extrasFactory');

class DeckForge {
    constructor(cards) {
        this.extrasFactory = new ExtrasFactory();
        const conjuredCards = ['Conjuration', 'Conjured Alteration Spell'];
        this.cardsByCode = cards;
        this.allCards = Object.values(this.cardsByCode);
        this.conjurations = this.allCards.filter((c) => conjuredCards.includes(c.type));
        this.playableCards = this.allCards.filter((c) => ![...conjuredCards, 'Phoenixborn'].includes(c.type));
    }

    createDeck(pbStub, dice, constraints = {}) {
        const deck = this.buildDeck(
            pbStub,
            dice.map((c) => ({ magic: c.magic, count: 0 })),
            constraints
        );
        return deck;
    }

    buildDeck(pbStub, dice, constraints) {
        var pbData = this.getCard(pbStub);

        // get legal cards in dice color
        this.legalCards = this.playableCards.filter(card => {
            // allowed dice types only
            return (!card.dice || this.allowedDiceTypes(card.dice, dice)) &&
                // no pb uniques unless it's mine
                (!card.phoenixborn || card.phoenixborn === pbData.name)
        });

        // get 30 cards
        const deckCards = [];
        // add unique if it is allowed in dice types
        const unique = this.getPbUniqueCard(pbData.name);
        if (!unique.dice || this.allowedDiceTypes(unique.dice, dice)) {
            this.addCardToStack(
                unique,
                deckCards,
                Math.min(constraints.maxCardCount, 3),
                constraints
            );
        }

        // draw 30 cards
        while (deckCards.length < 30) {
            let nextCard = this.getPlayableCard();
            // if (deckCards.length === 3) {
            //     nextCard = this.getPlayableCard(c => c.stub === 'summon-emperor-lion');
            // }
            // const nextCard = this.getPlayableCard();
            if (this.cardCanBeAdded(deckCards, nextCard, pbData, dice, constraints)) {
                this.addCardToStack(nextCard, deckCards, 1, constraints);
            }
        }

        // process cards to card counts
        var cardCounts = [];
        deckCards.forEach(c => {
            const cc = cardCounts.find(cc => cc.id === c.stub);
            if (cc) {
                cc.count++;
            } else {
                cardCounts.push({
                    id: c.stub,
                    count: 1,
                    card: c
                });
            }
        });

        // work out dice counts
        this.setDiceCounts(dice, deckCards);

        const conjurationCounts = [];
        deckCards.concat(pbData).forEach(c => {
            if (c.conjurations) {
                c.conjurations.forEach(conj => {
                    const cc = conjurationCounts.find(co => co.id === conj.stub);
                    if (!cc) {
                        conjurationCounts.push({
                            id: conj.stub,
                            card: conj,
                            count: 0
                        });
                    }
                });
            }
        });
        conjurationCounts.forEach((cc) => {
            const conj = this.allCards.find((c) => c.stub === cc.id);
            if (conj) {
                cc.count = conj.copies;
            }
        });

        return {
            cards: cardCounts,
            conjurations: conjurationCounts,
            phoenixborn: [
                {
                    id: pbData.stub,
                    count: 1,
                    card: pbData
                }
            ],
            dicepool: dice
        };
    }

    setDiceCounts(dice, deckCards) {
        const diceCounts = { total: 0 };
        dice.forEach(d => {
            diceCounts[d.magic] = deckCards.filter(dc => dc.dice && dc.dice.includes(d.magic)).length;
            diceCounts.total += diceCounts[d.magic];
        });
        let diceTotal = 0;
        dice.forEach(d => {
            d.count = Math.round(diceCounts[d.magic] / diceCounts.total * 10);
            diceTotal += d.count;
        });
        switch (diceTotal) {
            case 12:
                this.removeDie(2, dice);
                break;
            case 11:
                this.removeDie(1, dice);
                break;
            case 9:
                dice[0].count += 1;
                break;
            default:
                break;
        }
    }

    removeDie(count, dice) {
        for (let i = 0; i < count; i++) {
            let options = dice.filter(d => d.count > 1);
            const j = Math.floor(Math.random() * (options.length));
            dice[j].count -= 1;
        }
    }

    addCardToStack(card, stack, quantity = 1, constraints) {
        let amount = quantity;
        let extras = null;
        if (!constraints.noExtras) {
            const extras = this.getCardExtras(card, stack);
            amount = extras && extras.quantity ? extras.quantity : quantity;
        }
        for (let i = 0; i < amount; i++) {
            stack.push(card);
        }
        if (extras && extras.also && typeof extras.also === 'function') {
            extras.also(stack, this)
        }
    }

    cardCanBeAdded(deckCards, nextCard, pbData, dice, constraints) {
        if (!constraints.noExtras) {
            if (nextCard.type === 'Ready Spell' && !deckCards.includes(nextCard)) {
                const readySpellCount = _.uniq(deckCards).filter(c => c.type === 'Ready Spell' && !c.name.includes('Law')).length;
                if (readySpellCount > pbData.spellboard) {
                    return false;
                }
            }
            if (nextCard.stub === 'royal-charm') {
                if (!dice.some(d => d.magic === 'divine' || d.magic === 'charm')) {
                    return false;
                }
            }
            if (this.getSpaceNeeded(nextCard, deckCards) > 30 - deckCards.length) {
                return false;
            }
        }
        const cardCount = deckCards.filter(c => c === nextCard).length;
        return constraints.maxCardCount ? cardCount < constraints.maxCardCount : cardCount < 3;
    }

    getSpaceNeeded(card, stack) {
        const extras = this.getCardExtras(card, stack);
        if (extras) {
            return extras.spaceNeeded;
        } else
            return 1;
    }


    diceCharToMagicType(dChar) {
        let magics = [
            { char: 'H', magic: 'charm' },
            { char: 'C', magic: 'ceremonial' },
            { char: 'I', magic: 'illusion' },
            { char: 'N', magic: 'natural' },
            { char: 'D', magic: 'divine' },
            { char: 'S', magic: 'sympathy' },
            { char: 'T', magic: 'time' }
        ];
        return magics.find(m => m.char === dChar).magic;
    }

    allowedDiceTypes(diceTypes, legalDice) {
        return diceTypes.reduce((agg, dt) => agg && (dt === 'basic' || legalDice.some(ld => ld.magic === dt)), true)
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

    getCard(stub) {
        return this.allCards.find(c => c.stub === stub);
    }

    getPbUniqueCard(name) {
        return this.playableCards.find(c => c.phoenixborn === name);
    }

    getPlayableCard(filter = undefined) {
        let source = this.legalCards;
        if (filter) {
            source = this.legalCards.filter(filter);
        }
        return this.getRandomCard(source);
    }

    findCards(quantity, filter) {
        const result = [];
        for (let i = 0; i < quantity; i++) {
            result.push(this.getPlayableCard(filter));
        }
        return result;
    }

    getRandomCard(source) {
        const i = Math.floor(Math.random() * (source.length));
        return source[i];
    }

    getCardExtras(card, stack) {
        return this.extrasFactory.getCardExtras(card, stack);
    }
}

module.exports = DeckForge;