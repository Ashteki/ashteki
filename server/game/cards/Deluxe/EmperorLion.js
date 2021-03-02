const Card = require('../../Card.js');

class EmperorLion extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                location: 'deck',
                controller: 'self',
                cardCondition: (card) => card.name.startsWith('Law '),
                gameAction: [
                    ability.actions.reveal(),
                    ability.actions.moveCard({ destination: 'hand' })
                ]
            },
            then: {}
        });
    }
}

EmperorLion.id = 'emperor-lion';

module.exports = EmperorLion;
