const Card = require('../../Card.js');

class Devotion extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyLife(1),
                ability.effects.modifyRecover(1),
                ability.effects.cardCannot('attack'),
                ability.effects.alert()
            ]
        });

        this.forcedReaction({
            when: {
                onCardAttached: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.removeExhaustion(() => ({
                target: this.parent,
                amount: 1
            }))
        });
    }

    canAttach(card, context) {
        const myCondition = card.owner === context.player;
        return super.canAttach(card, context) && myCondition;
    }
}

Devotion.id = 'devotion';

module.exports = Devotion;
