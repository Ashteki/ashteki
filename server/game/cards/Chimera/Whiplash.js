const AspectCard = require('../../solo/AspectCard');

class Whiplash extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: 'Whiplash',
            targets: {
                damaged: {
                    mode: 'auto',
                    promptTitle: 'Whiplash',
                    cardCondition: (card) => card.damage,
                    // aim: 'left',
                },
                undamaged: {
                    mode: 'auto',
                    promptTitle: 'Whiplash',
                    // aim: 'left',
                }
            },
            gameAction: ability.actions.conditional({
                condition: (context) => context.targets.damaged,
                trueGameAction: ability.actions.destroy((context) => ({
                    target: context.targets.damaged,
                    showMessage: true
                })),
                falseGameAction: ability.actions.dealDamage((context) => ({
                    amount: 1,
                    target: context.targets.undamaged,
                    showMessage: true
                }))
            })
        });
    }
}

Whiplash.id = 'whiplash';

module.exports = Whiplash