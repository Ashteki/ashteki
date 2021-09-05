const { Level, Magic, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonIndiglowCreeper extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Indiglow Creeper',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Natural),
                    new DiceCount(1, Level.Class, Magic.Sympathy)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'indiglow-creeper'
            }),
            then: {
                condition: () => this.focus >= 1,
                gameAction: ability.actions.addStatusToken({
                    promptForSelect: {
                        optional: true,
                        activePromptTitle: 'Choose a unit to add 1 status token to',
                        cardType: BattlefieldTypes,
                        controller: 'self'
                    }
                })
            }
        });
    }
}

SummonIndiglowCreeper.id = 'summon-indiglow-creeper';

module.exports = SummonIndiglowCreeper;
