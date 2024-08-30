const AspectCard = require("../../../solo/AspectCard");

class Warcry extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedReaction({
            // why does this one need messageArgs when normally it doesn't?
            message: '{0} ability is triggered',
            messageArgs: (context) => context.source,
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        (context.source.isAttacker ||
                            event.attackers.some((a) =>
                                event.attackingPlayer.areCardsAdjacent(a, context.source)
                            ))
                    );
                }
            },
            gameAction: ability.actions.attachConjuredAlteration((context) => ({
                conjuredAlteration: 'vigor',
                target: context.event.attackers[0]
            }))
        });
    }
}

Warcry.id = 'warcry';

module.exports = Warcry;
