const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonTimeHopper extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Time Hopper',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Time)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'time-hopper'
            }),
            then: {
                condition: (context) =>
                    context.source.focus > 0 &&
                    context.player.unitsInPlay.some(
                        (c) => c.id === 'time-hopper' && c.status > 0 && !c.exhausted
                    ),
                gameAction: ability.actions.summon({
                    conjuration: 'time-hopper'
                })
            }
        });
    }
}

SummonTimeHopper.id = 'summon-time-hopper';

module.exports = SummonTimeHopper;
