const { CardType } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class StunningImpact extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedReaction({
            title: 'Stunning Impact',
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        context.source.isAttacker
                    );
                }
            },
            target: {
                toSelect: 'player',
                autoTarget: (context) => context.player.opponent,
                gameAction: ability.actions.chosenReturn((context) => ({
                    destination: 'hand',
                    target: context.player,
                    cardType: CardType.ReadySpell,
                    cardCondition: (card) => !card.exhausted
                }))
            }
        });
    }
}

StunningImpact.id = 'stunning-impact';

module.exports = StunningImpact;
