const { BattlefieldTypes, Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class CanyonShelter extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Shelter Unit',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            condition: (context) =>
                context.player.cardsInPlay.filter((c) => c.exhausted).length > 0,
            target: {
                controller: 'self',
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.exhausted,
                gameAction: ability.actions.sequential([
                    ability.actions.purge(),
                    ability.actions.placeUnder((context) => ({
                        parent: context.source,
                        facedown: true
                    }))
                ])
            },
            effect: 'place {1} under canyon shelter',
            effectArgs: (context) => context.target
        });

        this.action({
            title: 'Return Unit',
            condition: (context) => context.source.childCards.length > 0,
            cost: [
                ability.costs.mainAction(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Time)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.putIntoPlay((context) => ({
                promptWithHandlerMenu: {
                    activePromptTitle: 'Choose a card to return to play',
                    cards: context.source.childCards
                }
            })),
            then: {
                target: {
                    gameAction: ability.actions.addStatusToken(),
                    autoTarget: (context) => context.preThenEvent.card
                }
            }
        });
    }

    getRecover() {
        return this.childCards.length;
    }

    hasModifiedRecover() {
        return this.getRecover() > 0;
    }
}

CanyonShelter.id = 'canyon-shelter';

module.exports = CanyonShelter;
