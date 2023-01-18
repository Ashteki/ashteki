const Card = require('../../Card.js');

class LightBringer extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                toSelect: 'player',
                autoTarget: (context) => context.player.opponent,

                gameAction: ability.actions.delayedEffect({
                    when: {
                        onBeginTurn: () => true
                    },
                    gameAction: ability.actions.lastingEffect((context) => ({
                        targetController: 'opponent',
                        effect: ability.effects.mustAttack('spendMain'),
                        until: {
                            onTurnEnded: (event) => event.player === context.player.opponent
                        }
                    }))
                })
            },
            effect: 'force {1} to attack with their next main action',
            effectArgs: (context) => context.player.opponent
        });
    }
}

LightBringer.id = 'light-bringer';

module.exports = LightBringer;
