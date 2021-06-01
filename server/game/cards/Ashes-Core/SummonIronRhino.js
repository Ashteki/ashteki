const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonIronRhino extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Iron Rhino',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dynamicDice((context) => {
                    return [new DiceCount(6 - context.source.focus, Level.Basic)];
                })
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'iron-rhino'
            })
        });
    }
}

SummonIronRhino.id = 'summon-iron-rhino';

module.exports = SummonIronRhino;
