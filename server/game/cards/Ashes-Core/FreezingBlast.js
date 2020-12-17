const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FreezingBlast extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Freezing Blast',
            target: {
                cardType: BattlefieldTypes,
                gameAction: [
                    ability.actions.dealDamage({ amount: 2 }),
                    ability.actions.removeStatus({ amount: 2 })
                ]
            }
        });
    }
}

FreezingBlast.id = 'freezing-blast';

module.exports = FreezingBlast;
