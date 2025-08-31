const Card = require('../../Card.js');

class Cataclysm extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Cataclysm',
            effect: 'deal 1 damage to all units',
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => [
                    ...context.game.unitsInPlay,
                    context.player.phoenixborn,
                    context.player.opponent.phoenixborn
                ],
                gameAction: ability.actions.orderedAoE({
                    gameAction: ability.actions.dealDamage({ showMessage: true }),
                    promptTitle: 'Cataclysm'
                })
            },
            then: {
                gameAction: ability.actions.conditional({
                    condition: (context) => context.priorContext.multiCounter >= 2,
                    trueGameAction: ability.actions.summon({
                        conjuration: 'rubble-spirit',
                        count: 2
                    })
                })
            }
        });
    }
}

Cataclysm.id = 'cataclysm';

module.exports = Cataclysm;
