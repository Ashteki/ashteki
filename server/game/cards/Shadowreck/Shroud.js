const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Shroud extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            cost: ability.costs.exhaust(),
            location: 'spellboard',
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller == context.player &&
                    event.card.type === CardType.Conjuration
            },
            gameAction: ability.actions.cardLastingEffect((context) => ({
                target: context.event.card,
                until: {
                    onBeginTurn: (event) => event.player === context.player,
                    onBeginRound: () => true
                },
                effect: [
                    ability.effects.cannotBeSpellTarget(),
                    ability.effects.cannotBeAbilityTarget(),
                    ability.effects.cannotBeDicePowerTarget(),
                    ability.effects.cannotBeAttackTarget()
                ]
            }))
        });

    }
}

Shroud.id = 'shroud';

module.exports = Shroud;
