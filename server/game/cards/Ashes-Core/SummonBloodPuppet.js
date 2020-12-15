const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonBloodPuppet extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Blood Puppet',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Ceremonial)])
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
                    player: 'self',
                    cardType: 'Conjuration',
                    cardCondition: (card) => card.id === 'blood-puppet',
                    location: 'archives',
                    gameAction: ability.actions.putIntoPlay(() => ({
                        opponentControls: this.chosenValue
                    }))
                }
            }
        });
    }
}

SummonBloodPuppet.id = 'summon-blood-puppet';

module.exports = SummonBloodPuppet;
