const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class ChainedCreations extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'opponent',
                cardType: CardType.Conjuration,
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: {
                condition: (context) => context.preThenEvent.destroyEvent, // destroyed it
                target: {
                    controller: 'opponent',
                    location: 'spellboard',
                    cardType: CardType.ReadySpell,
                    cardCondition: (card, context) =>
                        card.conjurations.some((c) => c.stub === context.preThenEvent.card.id),
                    gameAction: ability.actions.exhaust({ showMessage: true })
                }
            }
        });
    }
}

ChainedCreations.id = 'chained-creations';

module.exports = ChainedCreations;
