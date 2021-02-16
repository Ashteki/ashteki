const Card = require('../../Card.js');

class RisingHorde extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            title: 'Raise Fallen',
            inexhaustible: true,
            target: {
                mode: 'upTo',
                numCards: 2,
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'fallen',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

RisingHorde.id = 'rising-horde';

module.exports = RisingHorde;
