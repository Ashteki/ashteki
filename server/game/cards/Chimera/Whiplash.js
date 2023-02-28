const AspectCard = require("../../solo/AspectCard");

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
            gameAction: ability.actions.destroy((context) => ({
                target: context.targets.damaged || context.targets.undamaged
            }))
        })
    }
}

Whiplash.id = 'whiplash';

module.exports = Whiplash