const Card = require('../../Card.js');

class Metamorpher extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            may: 'Use the Morph ability',
            when: {
                // it's my turn
                onBeginTurn: (event, context) => event.player === context.player
            },
            location: 'play area',
            gameAction: ability.actions.discard((context) => ({
                showMessage: true,
                target: context.source
            })),
            then: {
                target: {
                    controller: 'self',
                    cardType: 'Conjuration',
                    cardCondition: (card) => card.id === 'sun-scarab' || card.id === 'moon-moth',
                    location: 'archives',
                    gameAction: [ability.actions.putIntoPlay()]
                }
            }
        });
    }
}

Metamorpher.id = 'metamorpher';

module.exports = Metamorpher;
