const AspectCard = require('../../../solo/AspectCard');

class SowingStrike extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedReaction({
            title: 'Sow',
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        context.source.isAttacker
                    );
                }
            },
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.canSummon('scarlet-seed'),
                trueGameAction: ability.actions.summon({
                    conjuration: 'scarlet-seed'
                }),
                falseGameAction: ability.actions.addRedRainsToken((context) => ({
                    showMessage: true,
                    shortMessage: true,
                    warnMessage: true,
                    target: context.player.phoenixborn
                }))
            })
        });
    }

}

SowingStrike.id = 'sowing-strike';

module.exports = SowingStrike;
