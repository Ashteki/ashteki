const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SquallStallion extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                optional: true,
                cardType: BattlefieldTypes,
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.addStatusToken()
            }
        });

        this.persistentEffect({
            title: 'Fearful',
            effect: ability.effects.cardCannot('block')
        });
    }
}

SquallStallion.id = 'squall-stallion';

module.exports = SquallStallion;
