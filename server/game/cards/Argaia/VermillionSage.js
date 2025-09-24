const Card = require('../../Card.js');

class VermillionSage extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.filterDeck((context) => ({
                amount: 1,
                target: context.player
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw()
            }
        });

        this.inheritance();
    }
}

VermillionSage.id = 'vermillion-sage';

module.exports = VermillionSage;
