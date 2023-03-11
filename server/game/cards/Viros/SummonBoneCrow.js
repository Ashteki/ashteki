const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonBoneCrow extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Bone Crow',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Ceremonial)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.conditional({
                condition: (context) => context.game.turnEvents.unitDestroyed,
                trueGameAction: ability.actions.summon({
                    conjuration: 'bone-crow'
                })
            }),
            getWarnings: (context) => this.getWarnings(context)
        })
    }

    getWarnings(context) {
        if (!context.game.turnEvents.unitDestroyed) {
            return 'A unit has not been destroyed this turn.';
        }
    }
}

SummonBoneCrow.id = 'summon-bone-crow';

module.exports = SummonBoneCrow;
