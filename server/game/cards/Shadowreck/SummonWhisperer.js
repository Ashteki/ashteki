const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonWhisperer extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Whisperer',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Illusion)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'whisperer'
            }),
            then: {
                title: 'Summon Whisperer: Focus 2',
                condition: (context) => context.source.focus > 1,
                target: {
                    targetsPlayer: true,
                    toSelect: 'die',
                    dieCondition: (die) => die.level === Level.Power && !die.exhausted,
                    owner: 'opponent',
                    gameAction: ability.actions.lowerDie()
                }
            }
        });
    }
}

SummonWhisperer.id = 'summon-whisperer';

module.exports = SummonWhisperer;
