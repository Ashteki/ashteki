const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonShimmerWing extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Shimmer Wing',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Charm)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.draw(),
            then: Object.assign(
                { alwaysTriggers: true },
                this.getSummonActionObject('shimmer-wing')
            )
        });
    }
}

SummonShimmerWing.id = 'summon-shimmer-wing';

module.exports = SummonShimmerWing;
