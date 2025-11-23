const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class Dodge extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.player.opponent
            },
            gameAction: ability.actions.lastingEffect((context) => ({
                targetController: 'self',
                effect: ability.effects.preventAstralReturn(),
                duration: 'untilEndOfTurn'
            })),
            then: {
                target: {
                    activePromptTitle: 'Choose an exhausted Astral die to resolve',
                    optional: true,
                    toSelect: 'die',
                    owner: 'self',
                    dieCondition: (die) => die.magic === Magic.Astral, // && die.exhausted,
                    gameAction: ability.actions.resolveDieAbility()
                }
            }
        });
    }
}

Dodge.id = 'dodge';

module.exports = Dodge;
