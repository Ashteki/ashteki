const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class HuntMaster extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.addStatusToken({ amount: 2 }),
            then: {
                gameAction: ability.actions.summon({
                    conjuration: 'panther-spirit'
                })
            }
        });

        this.action({
            title: 'Guide 1',
            cost: [ability.costs.sideAction(), ability.costs.loseStatus()],
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(1)
                })
            }
        });
    }
}

HuntMaster.id = 'hunt-master';

module.exports = HuntMaster;
