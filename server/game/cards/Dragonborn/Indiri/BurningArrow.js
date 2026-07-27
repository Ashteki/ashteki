const AspectCard = require('../../../solo/AspectCard');

class BurningArrow extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);
        this.forcedInterrupt({
            title: 'Aggressive 1',
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        event.attackers.includes(context.source)
                    );
                }
            },
            gameAction: ability.actions.cardLastingEffect(() => ({
                target: this,
                effect: ability.effects.modifyAttack(1),
                duration: 'untilEndOfTurn'
            }))
        });

        this.ephemeral();
    }
}

BurningArrow.id = 'burning-arrow';

module.exports = BurningArrow;
