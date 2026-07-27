const AspectCard = require('../../../solo/AspectCard');

class Fletch extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.defender();
        this.forcedInterrupt({
            when: {
                onRoundEnded: () => true,
                onCardDestroyed: (event, context) => event.card === context.source
            },
            target: {
                autoTarget: (context) => context.player.phoenixborn,
                gameAction: ability.actions.addStatusToken()
            }
        });
    }
}

Fletch.id = 'fletch';

module.exports = Fletch;
