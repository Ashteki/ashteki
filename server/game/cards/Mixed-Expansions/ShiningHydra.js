const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class ShiningHydra extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Regenerate Heads',
            cost: [ability.costs.sideAction()],
            gameAction: ability.actions.removeDamage((context) => ({
                target: context.source
            })),
            then: {
                target: {
                    controller: 'self',
                    cardType: CardType.ConjuredAlteration,
                    cardCondition: (card) => card.id === 'shining-hydra-head',
                    location: 'archives',
                    gameAction: ability.actions.attach((context) => ({
                        upgrade: context.target,
                        target: context.source
                    }))
                }
            }
        });
    }
}

ShiningHydra.id = 'shining-hydra';

module.exports = ShiningHydra;
