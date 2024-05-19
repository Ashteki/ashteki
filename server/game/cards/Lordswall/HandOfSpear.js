const Card = require('../../Card.js');

class HandOfSpear extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.summon({
                conjuration: 'hand-of-shield'
            })
        });

        this.persistentEffect({
            effect: ability.effects.quickStrike()
        });
    }
}

HandOfSpear.id = 'hand-of-spear';

module.exports = HandOfSpear;
