const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FateReflection extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageDealt: (event, context) =>
                    event.context.player === context.player.opponent && // opponent action
                    BattlefieldTypes.includes(event.card.type) && // it's a unit
                    event.card.controller === context.player && // it's one of my units
                    !event.fightEvent // not a fight
            },
            gameAction: ability.actions.preventDamage((context) => ({
                event: context.event,
                amount: context.event.amount
            })),
            then: {
                alwaysTriggers: true, // need to target first, then deal damage if I want targetting to appear
                target: {
                    activePromptTitle: "Choose an opponent's unit to receive the damage instead",
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.preThenEvent.gameAction.amount, // needed to specify which amount method's amount to use
                        showMessage: true
                    }))
                }
            },
            message:
                '{0} plays {1} to prevent all damage to {2} then deals that damage to an opposing unit',
            messageArgs: (context) => [context.player, context.source, context.event.card]
        });
    }
}

FateReflection.id = 'fate-reflection';

module.exports = FateReflection;
