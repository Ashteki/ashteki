const AspectCard = require("../../../solo/AspectCard");

class ErraticStrike extends AspectCard {
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
            gameAction: ability.actions.rollBehaviourDie(),
            then: (thenContext) => ({
                target: {

                    mode: 'auto',
                    cardCondition: (card) => thenContext.dieResult % 2 == 0 ? card.exhausted : card.damage > 0,
                    aim: 'left',

                    gameAction: ability.actions.destroy({ showMessage: true })
                }
            })
        });
    }

}

ErraticStrike.id = 'erratic-strike';

module.exports = ErraticStrike;
