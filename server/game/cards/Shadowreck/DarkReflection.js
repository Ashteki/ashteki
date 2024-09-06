const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class DarkReflection extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Slay 2',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                promptTitle: 'Choose a target unit to deal damage to',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage(() => ({
                    amount: this.getAbilityNumeric(2),
                    showMessage: true
                }))
            }
        });

        //TODO: war within
        // this.destroyed({
        //     title: 'War Within',

        // });
    }
}

DarkReflection.id = 'dark-reflection';

module.exports = DarkReflection;
