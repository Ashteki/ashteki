const Card = require('../../Card.js');

class BeastMage extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword({ terrifying: 1 })
        });

        this.transform({ amount: 2 });
    }
}

BeastMage.id = 'beast-mage';

module.exports = BeastMage;
