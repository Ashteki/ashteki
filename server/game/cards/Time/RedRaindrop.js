const Card = require('../../Card.js');
const { BattlefieldTypes, CardType } = require('../../../constants.js');

class RedRaindrop extends Card {
    setupCardAbilities(ability) {
        // this.whileAttached({
        //     effect: [ability.effects.modifyAttack(1)]
        // });

        // this.action({
        //     inexhaustible: true,
        //     title: 'Spark',
        //     cost: [ability.costs.mainAction()],
        //     gameAction: ability.actions.discard({ target: this }),
        //     then: {
        //         target: {
        //             cardType: BattlefieldTypes,
        //             controller: 'any',
        //             gameAction: ability.actions.dealDamage({ showMessage: true }),
        //         }
        //     }
        // });
    }

    canAttach(card, context) {
        return card && card.getType() === CardType.Phoenixborn && this.canPlayAsUpgrade();
    }
}

RedRaindrop.id = 'red-raindrop';

module.exports = RedRaindrop;
