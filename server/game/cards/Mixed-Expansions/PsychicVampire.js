const Card = require('../../Card.js');

class PsychicVampire extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) =>
                context.event.damageEvent.damageSource.controller === context.source.controller.opponent,
            gameAction: ability.actions.chosenDiscard((context) => ({
                target: context.player.opponent
            }))
        });
    }
}

PsychicVampire.id = 'psychic-vampire';

module.exports = PsychicVampire;
