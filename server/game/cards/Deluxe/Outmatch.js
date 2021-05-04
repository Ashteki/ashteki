const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Outmatch extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent
            },
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(4)
                })
            }
        });
    }
}

Outmatch.id = 'outmatch';

module.exports = Outmatch;
