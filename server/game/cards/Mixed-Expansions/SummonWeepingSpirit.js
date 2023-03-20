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
            target: {
                toSelect: 'player',
                activePromptTitle: "Which player's battlefield?",
                choices: ["Opponent's", 'Mine'],
                gameAction: this.game.actions.summon({
                    conjuration: 'weeping-spirit'
                })
            },
            then: {
                condition: () => this.focus > 0,
                target: {
                    optional: true,
                    activePromptTitle: 'Choose a card to remove from the game',
                    location: 'discard',
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

SummonWeepingSpirit.id = 'summon-weeping-spirit';

module.exports = SummonWeepingSpirit;
