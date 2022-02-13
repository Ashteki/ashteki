const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class VoidPulse extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.owner // my attack
                    );
                }
            },
            target: {
                activePromptTitle: 'Choose a unit to receive damage',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({
                    amount: this.game.attackState.battles.length // X = the number of attackers. Need to test
                })
            },
            then: {
                condition: (context) => context.preThenEvent.destroyEvent,
                gameAction: [
                    ability.actions.draw({ amount: 2 }),
                    // TODO: this needs restricting to a single player
                    ability.actions.changeDice((context) => ({
                        numDice: 2,
                        owner: context.player.checkRestrictions('changeOpponentsDice') ? 'any' : 'self'
                    }))
                ]
            }
        });
    }
}

VoidPulse.id = 'void-pulse';

module.exports = VoidPulse;