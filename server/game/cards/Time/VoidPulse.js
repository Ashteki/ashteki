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
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: this.getAttackers(context) // X = the number of attackers
                }))
            },
            then: {
                condition: (context) => context.preThenEvent.destroyEvent,
                gameAction: ability.actions.draw({ amount: 2 }),
                // TODO: this needs restricting to a single player, and should target that player.
                then: (context) => ({
                    alwaysTriggers: true,
                    gameAction: ability.actions.changeDice({
                        numDice: 2,
                        owner: context.player.checkRestrictions('changeOpponentsDice') ? 'any' : 'self'
                    })
                })
            }
        });
    }

    getAttackers(context) {
        const attackers = context.player.unitsInPlay.filter((c) => c.isAttacker).length;
        return attackers;
    }
}

VoidPulse.id = 'void-pulse';

module.exports = VoidPulse;
