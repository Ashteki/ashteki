const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ChaosGravity extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Chaos Gravity',
            target: {
                activePromptTitle: 'Choose a unit to exhaust',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                optional: true,
                targets: {
                    from: {
                        activePromptTitle: 'Choose an exhausted unit',
                        cardType: BattlefieldTypes
                    },
                    to: {
                        dependsOn: 'from',
                        activePromptTitle: 'Choose a target unit',
                        cardType: BattlefieldTypes,
                        cardCondition: (card, context) =>
                            card.controller === context.targets.from.controller,
                        gameAction: ability.actions.moveToken((context) => ({
                            from: context.targets.from,
                            to: context.targets.to,
                            type: 'exhaustion'
                        }))
                    }
                },
                message: '{0} moves an exhaustion token from {3} to {4}',
                messageArgs: (context) => [context.targets.from, context.targets.to],
                then: {
                    alwaysTriggers: true,
                    optional: true,
                    target: {
                        activePromptTitle: 'Choose an exhausted unit',
                        cardType: BattlefieldTypes,
                        gameAction: ability.actions.removeExhaustion()
                    },
                    message: '{0} removes an exhaustion token from {2}',
                    messageArgs: (context) => [context.target]
                }
            }
        });
    }
}

ChaosGravity.id = 'chaos-gravity';

module.exports = ChaosGravity;
