const { CardType } = require('../../../constants.js');
const AbilityTargetCard = require('../../AbilityTargets/AbilityTargetCard.js');
const Card = require('../../Card.js');

class Vanish extends Card {
    // on target my unit with a spell / ability / dice power (not attack) - play to cancel
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onAbilityInitiated: (event, context) =>
                    event.context.player === context.player.opponent &&
                    // it's targetting my phoenixborn
                    (this.targetsPhoenixborn(event, context) || this.targetsPlayer(event, context))
            },
            effect: 'cancel the {1} ability',
            effectArgs: (context) => context.event.context.ability.title,
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                cancel: true
            }))
        });
    }

    targetsPhoenixborn(event, context) {
        return Object.values(event.context.targets).some(
            (t) => t.controller === context.player && t.type === CardType.Phoenixborn
        );
    }

    targetsPlayer(event, context) {
        // explicit targetting via gameAction target property
        if (
            event.context.ability.gameAction.some(
                (g) =>
                    g.targetType.some((tt) => tt === 'player') &&
                    g.target.some((t) => t === context.player)
            )
        )
            return true;

        // implicit flag when targetting a card - transfer does this for convenience
        const triggeringTargets = event.context.ability.targets.filter(
            (t) => t instanceof AbilityTargetCard && t.properties.targetsPlayer
        );
        return triggeringTargets.some(
            (t) => event.context.targets[t.name].controller === context.player
        );
    }
}

Vanish.id = 'vanish';

module.exports = Vanish;
