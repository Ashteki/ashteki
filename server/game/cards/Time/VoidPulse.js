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
                then: {
                    target: {
                        mode: 'select',
                        activePromptTitle: "Void Pulse: Choose which player's dice pool to affect",
                        choices: (context) => this.getPlayerOptions(context),
                        choiceHandler: (choice) => (this.chosenValue = choice.value)
                    },
                    then: {
                        alwaysTriggers: true,
                        gameAction: ability.actions.changeDice((context) => ({
                            dieCondition: (die) => !die.exhausted,
                            numDice: 2,
                            owner:
                                this.chosenValue === context.player.opponent.name
                                    ? 'opponent'
                                    : 'self'
                        }))
                    }
                }
            }
        });
    }

    getAttackers(context) {
        const attackers = context.player.unitsInPlay.filter((c) => c.isAttacker).length;
        return attackers;
    }

    getPlayerOptions(context) {
        let choices = [context.player.name];

        if (context.player.checkRestrictions('changeOpponentsDice')) {
            choices.push(context.player.opponent.name);
        }
        return choices.map((t) => ({ text: t, value: t }));
    }
}

VoidPulse.id = 'void-pulse';

module.exports = VoidPulse;
