const { PhoenixbornTypes } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class FromTheDepths extends AspectCard {
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
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.attachConjuredAlteration({
                    targetType: PhoenixbornTypes,
                    conjuredAlteration: 'drowning'
                })
            },
            then: {
                alwaysTriggers: true,
                target: {
                    mode: 'auto',
                    aim: 'left',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.player.opponent.phoenixborn.getKeywordValue('drowning'),
                        showMessage: true
                    }))
                }
            }
        });
    }

}

FromTheDepths.id = 'from-the-depths';

module.exports = FromTheDepths;
