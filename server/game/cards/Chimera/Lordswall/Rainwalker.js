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
            gameAction: ability.actions.destroy()
        });
    }
}

Rainwalker.id = 'rainwalker';

module.exports = Rainwalker;
