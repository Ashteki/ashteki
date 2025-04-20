const Card = require('../../Card.js');

class Undaunted extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyAttack(1),
                ability.effects.modifyLife(1),
                ability.effects.modifyRecover(1)
            ]
        });

        this.forcedReaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source && event.parent.controller === context.player
            },
            autoResolve: true,
            gameAction: ability.actions.ready((context) => ({
                target: context.source.parent
            }))
        });
    }
}

Undaunted.id = 'undaunted';

module.exports = Undaunted;
