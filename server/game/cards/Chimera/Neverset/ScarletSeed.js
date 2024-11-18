const AspectCard = require('../../../solo/AspectCard');

class ScarletSeed extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            gameAction: ability.actions.conditional({
                condition: (context) => context.source.status === 0,
                trueGameAction: [
                    ability.actions.discard({ target: this }),
                    ability.actions.addRedRainsToken((context) => ({
                        showMessage: true,
                        shortMessage: true,
                        warnMessage: true,
                        target: context.player.phoenixborn
                    }))
                ]
            })
        });
    }
}

ScarletSeed.id = 'scarlet-seed';

module.exports = ScarletSeed;
