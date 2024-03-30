const AspectCard = require('../../../solo/AspectCard');

class ExplosivePods extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => context.game.unitsInPlay,
                gameAction: ability.actions.conditional({
                    condition: (context) => context.source.status === 0,
                    trueGameAction: ability.actions.orderedAoE({
                        gameAction: ability.actions.dealDamage({ amount: 2, showMessage: true }),
                        promptTitle: 'Explosive Pods'
                    })
                })
            }
        });
    }

    get statusCount() {
        return 3;
    }
}

ExplosivePods.id = 'explosive-pods';

module.exports = ExplosivePods;
