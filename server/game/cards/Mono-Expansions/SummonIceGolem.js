const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonIceGolem extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Ice Golem',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(2, Level.Class, Magic.Natural),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'ice-golem'
            }),
            then: {
                condition: () => this.focus === 2,
                gameAction: ability.actions.removeDamage((context) => ({
                    amount: 1,
                    target: context.player.unitsInPlay.filter((c) => c.id === 'ice-golem')
                }))
            }
        });
    }
}

SummonIceGolem.id = 'summon-ice-golem';

module.exports = SummonIceGolem;
