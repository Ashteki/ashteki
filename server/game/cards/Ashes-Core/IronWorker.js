const Card = require('../../Card.js');

class IronWorker extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.additionalDraw(2)
        });
    }
}

IronWorker.id = 'iron-worker';

module.exports = IronWorker;
