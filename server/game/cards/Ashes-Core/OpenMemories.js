const { Location } = require('../../../constants.js');
const Card = require('../../Card.js');

class OpenMemories extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'place a card into their hand',
            target: {
                player: 'self',
                location: Location.Deck,
                gameAction: ability.actions.moveCard({ destination: Location.Hand, shuffle: true })
            }
        });
    }
}

OpenMemories.id = 'open-memories';

module.exports = OpenMemories;
