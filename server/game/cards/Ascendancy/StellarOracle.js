const Card = require('../../Card.js');

class StellarOracle extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.draw({ amount: 2 }),
            then: {
                target: {
                    activePromptTitle: 'Choose a card to return to the top of your deck',
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.returnToDeck({
                        shuffle: false,
                        reveal: false
                    })
                }
            }
        });
    }
}

StellarOracle.id = 'stellar-oracle';

module.exports = StellarOracle;
