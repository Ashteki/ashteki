const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class StrangeCopy extends Card {
    // You may play this spell after an opponent declares attackers.
    // Choose a unit you control to become a copy of a target unit for the remainder of the turn.
    // While a copy, that unit replaces its title, printed abilities and printed attack, life and
    // recover values with those of the target unit.
    // If a printed value is X, use the current value of X.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                // opponent declares attackers
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent
            },
            effect: 'to strange copy {0}',
            targets: {
                myUnit: {
                    activePromptTitle: 'Choose a unit you control to affect',
                    controller: 'self',
                    cardType: BattlefieldTypes
                },
                sourceUnit: {
                    activePromptTitle: 'Choose a target unit to copy',
                    cardType: BattlefieldTypes,
                    cardCondition: (card, context) => card !== context.targets.myUnit,
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        target: context.targets.myUnit,
                        duration: 'untilEndOfTurn',
                        effect: ability.effects.copyCard(context.targets.sourceUnit)
                    }))
                }
            }
        });
    }
}

StrangeCopy.id = 'strange-copy';

module.exports = StrangeCopy;
