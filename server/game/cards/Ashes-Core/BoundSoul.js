const { Location, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class BoundSoul extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'return an ally from discard to hand',
            target: {
                controller: 'self',
                location: Location.Discard,
                cardType: CardType.Ally,
                gameAction: ability.actions.moveCard({ destination: Location.Hand, shuffle: true })
            }
        });
    }
}

BoundSoul.id = 'bound-soul';

module.exports = BoundSoul;
