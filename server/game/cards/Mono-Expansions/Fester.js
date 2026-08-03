const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Fester extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Fester',
            target: {
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.damage > 0,
                gameAction: ability.actions.destroy({ showAlert: true })
            }
        });
    }
}

Fester.id = 'fester';

module.exports = Fester;
