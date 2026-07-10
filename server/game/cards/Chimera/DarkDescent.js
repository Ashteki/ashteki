const AspectCard = require("../../solo/AspectCard");

class DarkDescent extends AspectCard {
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
            target: {
                mode: 'auto',
                gameAction: ability.actions.conditional({
                    condition: (context) => context.target && context.target.exhausted,
                    trueGameAction: ability.actions.discard(),
                    falseGameAction: ability.actions.exhaust()
                })
            }
        });
    }
}

DarkDescent.id = 'dark-descent';

module.exports = DarkDescent