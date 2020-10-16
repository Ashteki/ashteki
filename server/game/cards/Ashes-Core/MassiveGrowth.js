const Card = require('../../Card.js');

class MassiveGrowth extends Card {
    setupCardAbilities(ability) {
        // TODO: spell guard
        this.whileAttached({
            effect: [ability.effects.modifyAttack(4), ability.effects.modifyLife(4)]
        });

        this.interrupt({
            title: 'Fleeting',
            when: {
                onTurnEnded: () => true
            },
            gameAction: ability.actions.discard((context) => ({
                card: context.source
            }))
        });
    }

    canAttach(card, context) {
        const myCondition = card.attack <= 2;
        return super.canAttach(card, context) && myCondition;
    }
}

MassiveGrowth.id = 'massive-growth';

module.exports = MassiveGrowth;
