const AspectCard = require('../../../solo/AspectCard');

class Shockwave extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        context.source.isAttacker
                    );
                }
            },
            targets: {
                left: {
                    mode: 'auto',
                    cardCondition: (card) => !card.exhausted,
                    aim: 'left'
                },
                right: {
                    mode: 'auto',
                    cardCondition: (card, context) => !card.exhausted && card !== context.targets.left,
                    aim: 'right'
                }
            },
            then: (context) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.sequential([
                    ability.actions.attachConjuredAlteration({
                        conjuredAlteration: 'stun',
                        target: context.targets.left
                    }),
                    ability.actions.attachConjuredAlteration({
                        conjuredAlteration: 'stun',
                        target: context.targets.right
                    })
                ])
            })
        });
    }
}

Shockwave.id = 'shockwave';

module.exports = Shockwave;
