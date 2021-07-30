const Card = require('../../Card.js');

class PsychicVampire extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) =>
                // condition triggers before the when: test, so need to ensure just respond to this card destroyed
                context.source === context.event.card &&
                (
                    context.event.context.source.controller === context.source.controller.opponent
                    ||
                    // damageEvent from opponent
                    (context.event.damageEvent &&
                        context.event.damageEvent.damageSource.controller ===
                        context.source.controller.opponent)
                    ||
                    (context.event.tokenEvent &&
                        context.event.tokenEvent.context.player ===
                        context.source.controller.opponent)
                )
            ,
            gameAction: ability.actions.chosenDiscard((context) => ({
                target: context.player.opponent
            }))
        });
    }
}

PsychicVampire.id = 'psychic-vampire';

module.exports = PsychicVampire;
