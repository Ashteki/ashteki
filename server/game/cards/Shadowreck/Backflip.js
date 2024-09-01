const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Backflip extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Backflip',
            target: {
                cardType: 'Ally',
                controller: 'self',
                gameAction: ability.actions.returnToHand()
            },
            then: {
                target: {
                    showCancel: true,
                    activePromptTitle: 'Choose a unit to increase its attack by 3',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.cardLastingEffect({
                        duration: 'untilEndOfTurn',
                        effect: ability.effects.modifyAttack(3)
                    })
                }
            }
        });
    }
}

Backflip.id = 'backflip';

module.exports = Backflip;
