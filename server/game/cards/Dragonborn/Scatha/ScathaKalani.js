const DragonbornCard = require('../../../solo/DragonbornCard');

class ScathaKalani extends DragonbornCard {
    setupCardAbilities(ability) {
        this.statusAbility({
            targets: {
                unit: {
                    mode: 'auto',
                    promptTitle: 'Poach',
                    aim: 'left'
                },
                pb: {
                    autoTarget: (context) => context.player.opponent.phoenixborn
                }
            },
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.targets.unit || context.targets.pb
            }))

        })
    }
}

ScathaKalani.id = 'scatha-kalani';

module.exports = ScathaKalani;
