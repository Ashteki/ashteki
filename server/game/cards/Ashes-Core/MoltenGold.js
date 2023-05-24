const Card = require('../../Card.js');
const { BattlefieldTypes, CardType, PhoenixbornTypes } = require('../../../constants.js');

class MoltenGold extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Molten Gold',
            target: {
                cardType: [...BattlefieldTypes, ...PhoenixbornTypes],
                gameAction: ability.actions.addDamageToken({ amount: 3 })
            },
            promptTitle: 'Choose a unit or PB to receive 3 wounds'
        });
    }
}

MoltenGold.id = 'molten-gold';

module.exports = MoltenGold;
