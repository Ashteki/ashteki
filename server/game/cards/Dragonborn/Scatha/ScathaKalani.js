const DragonbornCard = require('../../../solo/DragonbornCard');

class ScathaKalani extends DragonbornCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            title: 'Poach',
            log: 'each',
            condition: (context) => !context.source.exhausted,
            targets: {
                unit: {
                    mode: 'auto',
                    aim: 'left'
                },
                pb: {
                    autoTarget: (context) => context.player.opponent.phoenixborn
                }
            },
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.targets.unit || context.targets.pb
            }))
        });
    }
}

ScathaKalani.id = 'scatha-kalani';

module.exports = ScathaKalani;
