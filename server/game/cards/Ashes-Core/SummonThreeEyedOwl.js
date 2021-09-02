const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonThreeEyedOwl extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Three-Eyed Owl',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Charm)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'three-eyed-owl'
            })
        });
    }
}

SummonThreeEyedOwl.id = 'summon-three-eyed-owl';

module.exports = SummonThreeEyedOwl;
