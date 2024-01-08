const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonBastionBadger extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Bastion Badger',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Charm),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'bastion-badger'
            }),
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose a charm class die to raise',
                    optional: true,
                    toSelect: 'die',
                    dieCondition: (die) => !die.exhausted && die.level === Level.Class,
                    owner: 'self',
                    gameAction: ability.actions.raiseDie()
                }
            }
        });
    }
}

SummonBastionBadger.id = 'summon-bastion-badger';

module.exports = SummonBastionBadger;
