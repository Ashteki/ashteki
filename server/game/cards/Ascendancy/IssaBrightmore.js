const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class IssaBrightmore extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Inspiration',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Artifice)])
            ],
            gameAction: ability.actions.draw({ amount: 2 }),
            then: {
                target: {
                    activePromptTitle: 'Choose an exhausted Artifice die to resolve its die power',
                    optional: true,
                    toSelect: 'die',
                    owner: 'self',
                    dieCondition: (die) => die.magic === Magic.Artifice && die.exhausted,
                    gameAction: ability.actions.resolveDieAbility()
                }
            }
        });
    }
}

IssaBrightmore.id = 'issa-brightmore';

module.exports = IssaBrightmore;
