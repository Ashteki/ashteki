const AspectCard = require('../../../solo/AspectCard');

class Tyranny extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            unblankable: true,
            effect: [ability.effects.setPrintedAttack(() => this.owner.chimeraPhase)]
        });

        this.forcedReaction({
            title: 'Tyranny',
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        context.source.isAttacker
                    );
                }
            },
            gameAction: ability.actions.addRedRainsToken((context) => ({
                showMessage: true,
                shortMessage: true,
                warnMessage: true,
                target: context.player.phoenixborn
            }))
        });
    }
}

Tyranny.id = 'tyranny';

module.exports = Tyranny;
