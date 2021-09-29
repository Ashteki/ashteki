const { BattlefieldTypes } = require('../../../constants.js');
const AbilityTargetCard = require('../../AbilityTargets/AbilityTargetCard.js');
const Card = require('../../Card.js');

class GoldenVeil extends Card {
    // on target my unit with a spell / ability / dice power (not attack) - play to cancel
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onAbilityInitiated: (event, context) => {
                    const subjects = Array.isArray(event.context.target)
                        ? event.context.target
                        : Object.values(event.context.targets);
                    return (
                        event.context.player === context.player.opponent &&
                        event.context.ability.targets.some(
                            (t) =>
                                t instanceof AbilityTargetCard &&
                                t.properties.controller !== 'self' &&
                                !t.properties.ignoreTargetCheck
                        ) &&
                        subjects.some(
                            (t) =>
                                t.controller === context.player && BattlefieldTypes.includes(t.type)
                        )
                    );
                }
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

GoldenVeil.id = 'golden-veil';

module.exports = GoldenVeil;
