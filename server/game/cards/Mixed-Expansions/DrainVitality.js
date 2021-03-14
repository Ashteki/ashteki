const { BattlefieldTypes, Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class DrainVitality extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Damage',
            location: 'spellboard',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Ceremonial)])
            ],
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage()
            },
            then: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.removeDamage()
            }
        });

        this.action({
            title: 'Status',
            location: 'spellboard',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Sympathy)])
            ],
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.removeStatus()
            },
            then: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.addStatusToken()
            }
        });
    }
}

DrainVitality.id = 'drain-vitality';

module.exports = DrainVitality;
