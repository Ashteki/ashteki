const Card = require('../../Card.js');

class RaptorHerder extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                activePromptTitle: 'Call Raptor Hatchling',
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'raptor-hatchling',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

RaptorHerder.id = 'raptor-herder';

module.exports = RaptorHerder;
