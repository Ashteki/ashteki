const Card = require('../../Card.js');

class ShatteredSentinel extends Card {
    setupCardAbilities(ability) {
        this.alert();

        this.forcedInterrupt({
            title: 'Nether Strike 1',
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        event.attackers.includes(context.source) &&
                        context.source.controller.opponent.hasExhaustedUnit()
                    );
                }
            },
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => context.player.opponent.exhaustedUnits,
                gameAction: ability.actions.orderedAoE({
                    gameAction: ability.actions.dealDamage(),
                    promptTitle: 'Nether Strike 1'
                })
            }
        });
    }
}

ShatteredSentinel.id = 'shattered-sentinel';

module.exports = ShatteredSentinel;
