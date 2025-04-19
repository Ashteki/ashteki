const AspectCard = require('../../../solo/AspectCard');

class DeathKnell extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'last',
            target: {
                mode: 'auto',
                gameAction: ability.actions.conditional({
                    condition: (context) => context.source.status === 0,
                    trueGameAction: ability.actions.destroy()
                })
            }
        });
    }
}

DeathKnell.id = 'death-knell';

module.exports = DeathKnell;
