const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Copycat extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAbilityResolved: (event, context) =>
                    event.context.source.controller !== context.source.owner &&
                    ((event.context.source.type === CardType.ActionSpell &&
                        event.context.event?.name === 'onCardPlayed') ||
                        CardType.Phoenixborn === event.context.source.type)
            },
            gameAction: ability.actions.resolveAbility((context) => ({
                ability: this.getAbility(context)
            }))
        });
    }

    getAbility(context) {
        let result = context.event.context.ability;
        if (context.event.context.preThenEvent) {
            result = context.event.context.preThenEvent.context.ability;
            // This next step deals with effect, then effect, then effect (e.g. Phoenix Barrage)
            if (context.event.context.preThenEvent.context.preThenEvent) {
                result = context.event.context.preThenEvent.context.preThenEvent.context.ability;
            }
        }
        return result;
    }
}

Copycat.id = 'copycat';

module.exports = Copycat;
