const Card = require('../../Card.js');

class MindFogOwl extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.unseen()
        });
    }
}

MindFogOwl.id = 'mind-fog-owl';

module.exports = MindFogOwl;
