const Card = require('../../Card.js');

class ReflectionsInTheWater extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.blank()
        });

        this.interrupt({
            title: 'Fleeting (round)',
            when: {
                onRoundEnded: () => true
            },
            gameAction: ability.actions.discard((context) => ({
                card: context.source
            }))
        });
    }
}

ReflectionsInTheWater.id = 'reflections-in-the-water';

module.exports = ReflectionsInTheWater;
