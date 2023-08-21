const { Level, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class Rejuvenate extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            autoResolve: true,
            location: 'spellboard',
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller == context.player &&
                    event.card.type === CardType.Conjuration
            },
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 1,
                target: context.source
            }))
        });

        this.action({
            title: 'Rejuvenate',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Basic)]),
                ability.costs.loseAllStatus()
            ],
            location: 'spellboard',
            // gameAction: ability.actions.removeStatus({ all: true }),
            // then: (thenContext) => ({
            target: {
                activePromptTitle: 'Choose a conjuration to rejuvenate',
                cardType: CardType.Conjuration,
                controller: 'self',
                cardCondition: (card, context) => card.attack <= context.costs.statusPaid,
                gameAction: ability.actions.removeExhaustion()
            }
            // })
        });
    }
}

Rejuvenate.id = 'rejuvenate';

module.exports = Rejuvenate;
