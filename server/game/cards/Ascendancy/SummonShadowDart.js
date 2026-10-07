const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonShadowDart extends Card {
    setupCardAbilities(ability) {
        this.summon('shadow-dart', {
            title: 'Summon Shadow Dart',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Illusion)])
            ],
            location: 'spellboard'
        });
    }
}

SummonShadowDart.id = 'summon-shadow-dart';

module.exports = SummonShadowDart;
