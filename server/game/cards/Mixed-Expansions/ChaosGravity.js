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
                        activePromptTitle: 'Choose a unit to move exhaustion from',
                        cardType: BattlefieldTypes
                    },
                    to: {
                        ignoreTargetCheck: true,
                        dependsOn: 'from',
                        activePromptTitle: 'Choose a unit to move exhaustion to',
                        cardType: BattlefieldTypes,
                        cardCondition: (card, context) =>
                            card.controller === context.targets.from.controller,
                        gameAction: ability.actions.moveToken((context) => ({
                            from: context.targets.from,
                            to: context.targets.to,
                            // Assumption: normally the player would want to move an exhaustion token in preference to a gravityFlux exhaustion token
                            type: context.targets.from.hasToken('exhaustion') ? 'exhaustion' :
                                context.targets.from.hasToken('gravityFlux') ? 'gravityFlux' : 'exhaustion'
                        }))
                    }
                },
                message: '{0} moves an exhaustion token from {3} to {4}',
                messageArgs: (context) => [context.targets.from, context.targets.to],
                then: {
                    alwaysTriggers: true,
                    optional: true,
                    target: {
                        activePromptTitle: 'Choose a unit to remove exhaustion from',
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
