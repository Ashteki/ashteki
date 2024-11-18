const AspectCard = require("../../solo/AspectCard");

class Stormcall extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.dealDamage({ showMessage: true })
            },
            then: {
                condition: (context) => context.source.status === 0,
                gameAction: ability.actions.addRedRainsToken((context) => ({
                    showMessage: true,
                    shortMessage: true,
                    warnMessage: true,
                    target: context.player.phoenixborn
                }))
            }
        });
    }
}

Stormcall.id = 'stormcall';

module.exports = Stormcall