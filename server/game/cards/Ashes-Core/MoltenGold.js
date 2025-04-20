const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants.js');

class MoltenGold extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Molten Gold',
            target: {
                promptTitle: 'Choose a unit to receive 3 wounds',
                controller: 'opponent',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.addDamageToken({ amount: 3 })
            },
        });
    }
}

MoltenGold.id = 'molten-gold';

module.exports = MoltenGold;
