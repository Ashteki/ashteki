const Card = require('../../Card.js');

class BattleSeer extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.quickStrike()
        });

        this.alert();
    }
}

BattleSeer.id = 'battle-seer';

module.exports = BattleSeer;
