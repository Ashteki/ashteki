const Card = require('../../Card.js');

class ReflectionsInTheWater extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.blank()
        });

        this.fleeting();
    }

    get botTarget() {
        return 'opponent';
    }

    canAttach(card, context) {
        const botCondition =
            !context.player.isBot || !card.upgrades.some((u) => u.id === this.id);
        return super.canAttach(card, context) && botCondition;
    }
}

ReflectionsInTheWater.id = 'reflections-in-the-water';

module.exports = ReflectionsInTheWater;
