const Card = require('../../Card.js');

class Discovery extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.attachToPb((context) => ({
                upgrade: context.player.archives.find((c) => c.id === 'red-raindrop'),
                target: context.player.phoenixborn
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.returnToDeck()
            }
        });
    }
}

Discovery.id = 'discovery';

module.exports = Discovery;
