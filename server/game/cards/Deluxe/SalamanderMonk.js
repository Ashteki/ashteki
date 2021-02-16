const Card = require('../../Card.js');

class SalamanderMonk extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            inexhaustible: true,
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'salamander-monk-spirit',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SalamanderMonk.id = 'salamander-monk';

module.exports = SalamanderMonk;
