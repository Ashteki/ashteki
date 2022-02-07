const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class Purge extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Purge',
            location: 'spellboard',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Charm)])
            ],
            target: {
                mode: 'select',
                activePromptTitle: "Purge: Choose which player's deck",
                choices: [
                    { text: 'Mine', value: false },
                    { text: "Opponent's", value: true }
                ],
                choiceHandler: (option) => (this.chosenValue = option.value)
            },
            gameAction: ability.actions.discardTopOfDeck((context) => ({
                target: this.chosenValue ? context.player.opponent : context.player
            })),
            then: {
                condition: (context) => context.source.focus > 0,
                activePromptTitle: 'Purge: Activate focus 1 ability?',
                cost: ability.costs.dice([new DiceCount(1, Level.Basic)]),
                gameAction: ability.actions.discardTopOfDeck((context) => ({
                    target: this.chosenValue ? context.player.opponent : context.player
                }))
            }
        });
    }
}

Purge.id = 'purge';

module.exports = Purge;
