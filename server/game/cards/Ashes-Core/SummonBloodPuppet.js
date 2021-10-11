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
            target: {
                mode: 'select',
                activePromptTitle: "Which player's battlefield?",
                choices: {
                    Mine: this.game.actions.summon({
                        conjuration: 'blood-puppet',
                        opponentControls: false
                    }),
                    "Opponent's": this.game.actions.summon({
                        conjuration: 'blood-puppet',
                        opponentControls: true
                    })
                }
            }
        });
    }
}

SummonBloodPuppet.id = 'summon-blood-puppet';

module.exports = SummonBloodPuppet;
