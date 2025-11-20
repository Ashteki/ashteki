const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SkybreakCaptain extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Commander 1',
            cost: [ability.costs.sideAction()],
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(1)
                }))
            }
        });
    }
}

SkybreakCaptain.id = 'skybreak-captain';

module.exports = SkybreakCaptain;
