const Card = require('../../Card.js');

class ReflectionsInTheWater extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.blank()
        });

        this.fleeting();
    }
}

ReflectionsInTheWater.id = 'reflections-in-the-water';

module.exports = ReflectionsInTheWater;
