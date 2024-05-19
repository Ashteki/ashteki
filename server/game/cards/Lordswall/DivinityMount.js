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

        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        context.source.isAttacker
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
                        showMessage: true,
                        promptTitle: 'Lightning Breath 1'
                    })
                }))
            }
        });
    }
}

DivinityMount.id = 'divinity-mount';

module.exports = DivinityMount;
