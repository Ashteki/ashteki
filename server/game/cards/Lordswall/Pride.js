const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class Pride extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.preventGuard(),
                ability.effects.cannotBeGuarded()
            ]
        });

        this.forcedReaction({
            when: {
                onCardAttached: (event, context) => event.card === context.source &&
                    event.parent.controller === context.player
            },
            autoResolve: true,
            target: {
                activePromptTitle: 'Choose an exhausted Divine die to resolve its die power',
                optional: true,
                toSelect: 'die',
                owner: 'self',
                dieCondition: (die) => die.magic === Magic.Divine && die.exhausted,
                gameAction: ability.actions.resolveDieAbility()
            }
        });

    }
}

Pride.id = 'pride';

module.exports = Pride;
