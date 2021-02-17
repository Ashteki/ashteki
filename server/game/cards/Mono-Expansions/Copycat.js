const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Copycat extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAbilityResolved: (event, context) =>
                    event.context.source.controller !== context.source.owner &&
                    [CardType.ActionSpell, CardType.Phoenixborn].includes(event.context.source.type)
            },
            gameAction: ability.actions.resolveAbility((context) => ({
                ability: context.event.context.ability
            }))
        });
    }
}

Copycat.id = 'copycat';

module.exports = Copycat;
