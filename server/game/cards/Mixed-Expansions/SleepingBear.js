const Card = require('../../Card.js');

class SleepingBear extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.addExhaustionToken({ target: this })
        });
    }
}

SleepingBear.id = 'sleeping-bear';

module.exports = SleepingBear;
