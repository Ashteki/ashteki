const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class StaminaBurst extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => context.player.phoenixborn,
                gameAction: ability.actions.removeDamage({
                    amount: 1
                })
            },
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose a unit to receive a spark alteration',
                    cardType: BattlefieldTypes,
                    controller: 'self',
                    gameAction: ability.actions.attachConjuredAlteration({
                        conjuredAlteration: 'spark'
                    })
                },
                then: {
                    alwaysTriggers: true,
                    may: 'move the first player token',
                    target: {
                        mode: 'select',
                        activePromptTitle: 'Choose a player to receive the first player token',
                        choices: [
                            { text: 'Me', value: false },
                            { text: 'Opponent', value: true }
                        ],
                        choiceHandler: (option) => (this.chosenValue = option.value)
                    },
                    gameAction: ability.actions.makeFirstPlayer((context) => ({
                        target: this.chosenValue ? context.player.opponent : context.player
                    }))
                }
            }
        });
    }
}

StaminaBurst.id = 'stamina-burst';

module.exports = StaminaBurst;
