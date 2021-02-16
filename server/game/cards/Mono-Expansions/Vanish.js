const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Vanish extends Card {
    // on target my unit with a spell / ability / dice power (not attack) - play to cancel
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onAbilityInitiated: (event, context) =>
                    event.context.player === context.player.opponent &&
                    // it's targetting my phoenixborn
                    (Object.values(event.context.targets).some(
                        (t) => t.controller === context.player && t.type === CardType.Phoenixborn
                    ) ||
                        // it's targetting me as a player
                        event.context.ability.gameAction.some(
                            (g) =>
                                g.targetType.some((tt) => tt === 'player') &&
                                g.target.some((t) => t === context.player)
                        ))
            },
            effect: 'cancel the {1} ability',
            effectArgs: (context) => context.event.context.ability.title,
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                cancel: true
            }))
        });
    }
}

Vanish.id = 'vanish';

module.exports = Vanish;
