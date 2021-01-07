const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Amplify extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Amplify',
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                cardCondition: (card) => card.attack === 0,
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(3)
                })
            }
        });
    }
}

Amplify.id = 'amplify';

module.exports = Amplify;
