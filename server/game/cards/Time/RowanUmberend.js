const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class RowanUmberend extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.card.type === 'Ally' && event.card.controller == context.player
            },
            may: (context) => 'conscript the destroyed ' + context.event.card.name,
            gameAction: ability.actions.sequential([
                ability.actions.discard((context) => ({
                    target: context.source.childCards
                })),
                ability.actions.placeUnder((context) => ({
                    parent: context.source,
                    target: context.event.card,
                    facedown: true
                }))
            ]),
            effect: 'conscript {1}',
            effectArgs: (context) => context.event.card
        });

        this.action({
            title: 'Exhume',
            condition: (context) => context.source.childCards.length > 0,
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Basic)])
            ],
            effect: 'return a unit to play and then destroy it',
            gameAction: ability.actions.putIntoPlay((context) => ({
                target: context.source.childCards,
                showMessage: true
            })),
            then: {
                gameAction: ability.actions.destroy((context) => ({
                    target: context.preThenEvent.card
                }))
            }
        });
    }
}

RowanUmberend.id = 'rowan-umberend';

module.exports = RowanUmberend;
