const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ReturnToSoil extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Return to Soil',
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage()
            },
            then: {
                condition: (context) => context.preThenEvent.destroyEvent,
                gameAction: ability.actions.discardTopOfDeck(),
                then: {
                    target: {
                        location: 'discard',
                        controller: 'opponent',
                        mode: 'upTo',
                        numCards: 2,
                        gameAction: ability.actions.purge()
                    }
                }
            }
        });
    }
}

ReturnToSoil.id = 'return-to-soil';

module.exports = ReturnToSoil;
