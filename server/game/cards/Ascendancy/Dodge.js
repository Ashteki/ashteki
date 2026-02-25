const { Magic, BattlefieldTypes } = require('../../../constants.js');
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
                until: {
                    onTurnEnded: () => true
                },
                effect: ability.effects.preventAstralReturn()
            })),
            then: {
                target: {
                    toSelect: 'die',
                    autoTarget: (context) =>
                        context.player.findDie((die) => die.magic === Magic.Astral && die.exhausted),
                    gameAction: ability.actions.resolveDieAbility()
                }
            }
        });
    }
}

Dodge.id = 'dodge';

module.exports = Dodge;
