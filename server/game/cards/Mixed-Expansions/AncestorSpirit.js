const Card = require('../../Card.js');

class AncestorSpirit extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            may: 'draw a card',
            title: 'Guidance',
            gameAction: ability.actions.draw({ terrifying: 1 }),
            then: {
                target: {
                    activePromptTitle: 'Guidance',
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.returnToDeck({ bottom: true, shuffle: false })
                }
            }
        });
    }
}

AncestorSpirit.id = 'ancestor-spirit';

module.exports = AncestorSpirit;
