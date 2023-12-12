const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class ShimmerWing extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ritual Flames',
            cost: [ability.costs.mainAction(), ability.costs.dice([new DiceCount(1, Level.Basic)])],
            getWarnings: (context) => {
                if (context.player.unitsInPlay.filter((c) => c.id === 'shimmer-wing').length < 2) {
                    return "You don't have another Shimmer Wing to discard";
                }
            },
            // condition: (context) =>
            //     context.player.unitsInPlay.filter((c) => c.id === 'shimmer-wing').length === 2,
            target: {
                activePlayerPrompt: 'Choose another Shimmer Wing to discard',
                controller: 'self',
                cardCondition: (card, context) =>
                    card.id === 'shimmer-wing' && card !== context.source,
                gameAction: ability.actions.discard((context) => ({
                    target: [context.source, context.target]
                }))
            },
            then: {
                condition: (context) => context.preThenEvent.context.cardsDiscarded?.length === 2,
                gameAction: ability.actions.summon({
                    conjuration: 'eternity-flame'
                })
            }
        });
    }
}

ShimmerWing.id = 'shimmer-wing';

module.exports = ShimmerWing;
