const { Location } = require('../../../constants.js');
const Card = require('../../Card.js');

class BoundSoul extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'place 2 exhaustion tokens on a target unit',
            target: {
                player: 'self',
                location: Location.Discard,
                gameAction: ability.actions.moveCard({ destination: Location.Hand, shuffle: true })
            }
        });
    }
}

BoundSoul.id = 'bound-soul';

module.exports = BoundSoul;
