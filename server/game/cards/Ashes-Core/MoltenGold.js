const Card = require('../../Card.js');

class MoltenGold extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Molten Gold',
            target: {
                cardType: ['Ally', 'Conjuration', 'Phoenixborn'],
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            }
        });
    }
}

MoltenGold.id = 'molten-gold';

module.exports = MoltenGold;
