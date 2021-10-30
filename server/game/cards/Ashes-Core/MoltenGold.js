const Card = require('../../Card.js');
const { BattlefieldTypes, CardType } = require('../../../constants.js');

class MoltenGold extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Molten Gold',
            target: {
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                gameAction: ability.actions.addDamageToken({ amount: 3 })
            }
        });
    }
}

MoltenGold.id = 'molten-gold';

module.exports = MoltenGold;
