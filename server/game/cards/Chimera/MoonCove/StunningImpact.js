const { CardType } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class StunningImpact extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedInterrupt({
            title: 'Stunning Impact',
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        event.attackers.includes(context.source)
                    );
                }
            },
            target: {
                toSelect: 'player',
                autoTarget: (context) => context.player.opponent,
                gameAction: ability.actions.chosenReturn((context) => ({
                    destination: 'hand',
                    cardType: CardType.ReadySpell,
                    cardCondition: (card) => !card.exhausted
                }))
            }
        });
    }
}

StunningImpact.id = 'stunning-impact';

module.exports = StunningImpact;
