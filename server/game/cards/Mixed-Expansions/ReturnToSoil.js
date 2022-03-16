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
                gameAction: ability.actions.discardTopOfDeck((context) => ({
                    target:
                        context.preThenEvent.clone.controller === context.player.opponent
                            ? context.player.opponent
                            : context.player
                })),
                then: {
                    target: {
                        cardCondition: (card, context) =>
                            card !== context.preThenEvent.context.preThenEvent.context.target,
                        location: 'discard',
                        controller: (context) =>
                            context.preThenEvent.context.preThenEvent.clone.controller ===
                            context.player.opponent
                                ? 'opponent'
                                : 'self',
                        mode: 'upTo',
                        numCards: 2,
                        gameAction: ability.actions.purge({ showMessage: true })
                    }
                }
            }
        });
    }
}

ReturnToSoil.id = 'return-to-soil';

module.exports = ReturnToSoil;
