const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class JungleWarrior extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            inexhaustible: true,
            target: {
                optional: true,
                controller: 'self',
                activePromptTitle: 'Inheritance 1',
                cardType: BattlefieldTypes,
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.addStatusToken()
            }
        });
    }
}

JungleWarrior.id = 'jungle-warrior';

module.exports = JungleWarrior;
