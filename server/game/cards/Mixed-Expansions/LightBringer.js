const Card = require('../../Card.js');

class LightBringer extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.untilNextTurn({
                targetController: 'opponent',
                effect: ability.effects.mustAttack('spendMain')
            })
        });
    }
}

LightBringer.id = 'light-bringer';

module.exports = LightBringer;
