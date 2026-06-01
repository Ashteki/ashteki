const Card = require('../../Card.js');

class CloudSpirit extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            autoResolve: true,
            inexhaustible: true,
            title: 'Disperse',
            when: {
                onRoundEnded: () => true
            },
            message: 'Disperse: {0} is discarded',
            messageArgs: (context) => context.source,
            condition: (context) => context.player.countUnits('cloud-spirit') < 2,
            gameAction: ability.actions.discard((context) => ({
                card: context.source,
                showMessage: false
            }))
        });
    }
}

CloudSpirit.id = 'cloud-spirit';

module.exports = CloudSpirit;
