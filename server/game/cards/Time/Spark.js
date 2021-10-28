const Card = require('../../Card.js');

class Spark extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyAttack(1)]
        });

        this.action({
            inexhaustible: true,
            title: 'Spark',
            cost: [ability.costs.mainAction()],
            target: {
                cardType: ['Ally', 'Conjuration'],
                controller: 'any',
                gameAction: [
                    ability.actions.discard({ target: this }),
                    ability.actions.dealDamage({ showMessage: true })
                ]
            }
        });
    }
}

Spark.id = 'spark';

module.exports = Spark;
