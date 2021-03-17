const Card = require('../../Card.js');

class ShepherdOfLostSouls extends Card {
    setupCardAbilities() {
        return this.play({
            title: 'Reincarnate',
            target: {
                controller: 'self',
                cardType: 'Ally',
                cardCondition: (card) => card.id !== 'shepherd-of-lost-souls',
                location: 'discard',
                gameAction: this.game.actions.moveCard({ destination: 'hand' })
            },
            effect: 'move {0} from discard to hand'
        });
    }
}

ShepherdOfLostSouls.id = 'shepherd-of-lost-souls';

module.exports = ShepherdOfLostSouls;
