const AspectCard = require('../../../solo/AspectCard');

class Shockwave extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedInterrupt({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        event.attackers.includes(context.source)
                    );
                }
            },
            effect: "stun leftmost and rightmost opponent's units",
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
