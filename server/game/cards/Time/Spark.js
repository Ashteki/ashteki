const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants.js');

class Spark extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyAttack(1)]
        });

        this.action({
            inexhaustible: true,
            title: 'Spark',
            cost: [ability.costs.mainAction()],
            gameAction: ability.actions.discard({ target: this }),
            then: {
                target: {
                    cardType: BattlefieldTypes,
                    controller: 'any',
                    gameAction: ability.actions.dealDamage({ showMessage: true }),
                }
            }
        });
    }
}

Spark.id = 'spark';

module.exports = Spark;
