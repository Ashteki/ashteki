const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class Playtime extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            inexhaustible: true,
            effect: [
                ability.effects.modifyAttack(-1)
            ]
        });

        this.forcedReaction({
            autoResolve: true,
            when: {
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent,
                onDefendersDeclared: (event, context) => {
                    return event.attack.battles.some((b) => b.guard === context.source.parent);
                }
            },
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.player.phoenixborn,
                amount: 1
            }))
        });
    }
}

Playtime.id = 'playtime';

module.exports = Playtime;
