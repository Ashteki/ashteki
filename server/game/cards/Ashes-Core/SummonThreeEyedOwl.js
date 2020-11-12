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
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'three-eyed-owl',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonThreeEyedOwl.id = 'summon-three-eyed-owl';

module.exports = SummonThreeEyedOwl;
