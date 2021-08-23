const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Inflame extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyAttack(1),
                ability.effects.threatening()
            ]
        });
    }
}

Inflame.id = 'inflame';

module.exports = Inflame;
