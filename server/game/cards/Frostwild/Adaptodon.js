const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Adaptodon extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Adapt',
            cost: [ability.costs.sideAction()],
            condition: (context) =>
                !context.source.upgrades.some(
                    (u) => u.id === 'fire-adaptation' || u.id === 'ice-adaptation'
                ),
            target: {
                cardType: CardType.ConjuredAlteration,
                location: 'archives',
                cardCondition: (card) => card.id === 'fire-adaptation' || card.id === 'ice-adaptation',
                controller: 'self',
                gameAction: ability.actions.attach((context) => ({
                    target: context.source,
                    upgrade: context.target
                }))
            }
        });
    }
}

Adaptodon.id = 'adaptodon';

module.exports = Adaptodon;
