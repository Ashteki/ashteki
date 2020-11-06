const Card = require('../../Card.js');

class FadeAway extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Fade Away',
            when: {
                onRoundEnded: () => true
            },
            gameAction: ability.actions.destroy((context) => ({
                card: context.source
            }))
        });
    }
}

FadeAway.id = 'fade-away';

module.exports = FadeAway;
