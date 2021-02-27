const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonWeepingSpirit extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Weeping Spirit',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Charm)])
            ],
            location: 'spellboard',
            targets: {
                first: {
                    mode: 'options',
                    activePromptTitle: "Which player's battlefield?",
                    options: [
                        { name: 'Mine', value: false },
                        { name: "Opponent's", value: true }
                    ],
                    handler: (option) => (this.chosenValue = option.value)
                },
                conjuration: {
                    dependsOn: 'first',
                    controller: 'self',
                    cardType: 'Conjuration',
                    cardCondition: (card) => card.id === 'weeping-spirit',
                    location: 'archives',
                    gameAction: ability.actions.putIntoPlay(() => ({
                        opponentControls: this.chosenValue
                    }))
                }
            },
            then: {
                condition: () => this.focus > 0,
                target: {
                    optional: true,
                    activePromptTitle: 'Select a card to remove from the game',
                    location: 'discard',
                    controller: 'opponent',
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

SummonWeepingSpirit.id = 'summon-weeping-spirit';

module.exports = SummonWeepingSpirit;
