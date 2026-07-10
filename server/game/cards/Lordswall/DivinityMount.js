const Card = require('../../Card.js');

class DivinityMount extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            inexhaustible: true,
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 3,
                target: context.player.phoenixborn
            }))
        });

        this.forcedInterrupt({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        event.attackers.includes(context.source)
                    );
                }
            },
            may: "deal 1 damage to all opponent's units",
            target: {
                toSelect: 'player',
                autoTarget: (context) => context.player.opponent,
                gameAction: ability.actions.orderedAoE((context) => ({
                    target: context.player.opponent.unitsInPlay,
                    gameAction: ability.actions.dealDamage({
                        promptTitle: 'Lightning Breath 1'
                    })
                }))
            }
        });
    }
}

DivinityMount.id = 'divinity-mount';

module.exports = DivinityMount;
