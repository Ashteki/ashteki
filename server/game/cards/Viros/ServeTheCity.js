const { BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class ServeTheCity extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Serve the City',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust()
            ],
            location: 'spellboard',
            target: {
                optional: true,
                cardCondition: (card, context) => !card.exhausted,
                activePromptTitle: 'Choose a unit to Serve the City',
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.dealDamage()
            },
            then: {
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(1),
                    target: context.preThenEvent.card
                })),
                then: {
                    condition: (context) => context.preThenEvent.context.preThenEvent.card.canAttack(),
                    target: {
                        optional: true,
                        activePromptTitle: 'Choose a target to attack',
                        cardCondition: (card) => !card.anyEffect('cannotBeAttackTarget'),
                        cardType: [...PhoenixbornTypes, ...BattlefieldTypes],
                        controller: 'opponent',
                        gameAction: ability.actions.attack((context) => ({
                            attacker: context.preThenEvent.card
                        }))
                    },

                }

            }
        })
    }
}

ServeTheCity.id = 'serve-the-city';

module.exports = ServeTheCity;
