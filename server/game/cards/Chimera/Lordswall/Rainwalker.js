const AspectCard = require('../../../solo/AspectCard');

class Rainwalker extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.hordeAttack();
        this.feeble();

        // Ephemeral
        this.forcedReaction({
            inexhaustible: true,
            when: {
                onCardExhausted: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.destroy({ showMessage: false }),
            message: 'Ephemeral: {0} is destroyed',
            messageArgs: (context) => context.source
        });
    }
}

Rainwalker.id = 'rainwalker';

module.exports = Rainwalker;
