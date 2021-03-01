const Card = require('../../Card.js');

class BeastMage extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword({ terrifying: 1 })
        });

        this.persistentEffect({
            condition: () => !this.controller.firstPlayer,
            match: this,
            effect: [
                ability.effects.modifyAttack(2),
                ability.effects.modifyLife(2),
                ability.effects.modifyRecover(2)
            ]
        });
    }
}

BeastMage.id = 'beast-mage';

module.exports = BeastMage;
