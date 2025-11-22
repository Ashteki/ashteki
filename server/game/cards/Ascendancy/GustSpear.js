const Card = require('../../Card.js');

class GustSpear extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyAttack(1)]
        });

        this.forcedReaction({
            when: {
                onCardAttached: (event, context) => event.card === context.source
            },
            target: {
                activePromptTitle: 'Choose two of your opponent\'s active dice to lower one level',
                optional: true,
                toSelect: 'die',
                numDice: 2,
                owner: 'opponent',
                dieCondition: (die) => !die.exhausted,
                gameAction: ability.actions.lowerDie()
            }
        });
    }
}

GustSpear.id = 'gust-spear';

module.exports = GustSpear;
