const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonNightsongCricket extends Card {
    setupCardAbilities(ability) {
        this.preventAutoDice = true;

        this.action({
            title: 'Summon Nightsong Cricket',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Sympathy),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'nightsong-cricket'
            }),
            then: {
                condition: (context) =>
                    context.source.focus > 0 &&
                    context.preThenEvent.context.costs.returnDice.some(
                        (d) => d.level === Level.Power && d.magic === Magic.Sympathy
                    ),
                target: {
                    optional: true,
                    controller: 'any',
                    location: 'discard',
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

SummonNightsongCricket.id = 'summon-nightsong-cricket';

module.exports = SummonNightsongCricket;
