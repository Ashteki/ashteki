const Card = require('../../Card.js');

class SummonThreeEyedOwl extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Three-Eyed Owl',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([{ magic: 'charm', level: 'class' }])
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
