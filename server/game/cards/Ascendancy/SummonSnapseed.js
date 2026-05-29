const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonSnapseed extends Card {
    setupCardAbilities(ability) {
        this.summon(
            'snapseed',
            Object.assign({
                title: 'Summon Snapseed',
                cost: [
                    ability.costs.mainAction(),
                    ability.costs.exhaust(),
                    ability.costs.dice([new DiceCount(1, Level.Class, Magic.Natural)])
                ],
                location: 'spellboard',
                then: Object.assign(
                    {
                        condition: (context) => context.source.isCharged
                    },
                    this.getSummonActionObject('snapseed')
                )
            })
        );
    }
}

SummonSnapseed.id = 'summon-snapseed';

module.exports = SummonSnapseed;
