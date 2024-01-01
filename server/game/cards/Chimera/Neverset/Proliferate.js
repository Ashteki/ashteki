const AspectCard = require('../../../solo/AspectCard');

class Proliferate extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.defender();

        this.entersPlay({
            title: 'Proliferate',
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.canSummon('scarlet-seed'),
                trueGameAction: ability.actions.summon({
                    conjuration: 'scarlet-seed'
                }),
                falseGameAction: ability.actions.addRedRainsToken((context) => ({
                    showMessage: true,
                    shortMessage: true,
                    warnMessage: true,
                    target: context.player.phoenixborn
                }))
            })
        });
    }
}

Proliferate.id = 'proliferate';

module.exports = Proliferate;
