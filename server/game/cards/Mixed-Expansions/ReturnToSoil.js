const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ReturnToSoil extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Return to Soil',
            target: {
                activePromptTitle: 'Choose a unit to damage',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage({
                    postHandler: (context) => (this.firstTarget = context.target)
                })
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
                    alwaysTriggers: true,
                    target: {
                        activePromptTitle: 'Choose 2 cards to remove from the game',
                        cardCondition: (card, context) =>
                            card !== this.firstTarget,
                        location: 'discard',
                        controller: (context) =>
                            this.firstTarget.controller === context.player.opponent
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
