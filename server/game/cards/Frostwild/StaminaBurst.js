const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class StaminaBurst extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.removeDamage((context) => ({
                amount: 1,
                target: context.source.owner.phoenixborn
            })),
            then: {
                target: {
                    activePromptTitle: 'Choose a unit to receive a spark alteration',
                    cardType: BattlefieldTypes,
                    controller: 'self',
                    gameAction: ability.actions.attachConjuredAlteration({
                        conjuredAlteration: 'spark'
                    })
                },
                then: {
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
