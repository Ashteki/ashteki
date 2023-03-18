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
                    event.attackingPlayer === context.source.owner.opponent
                    && context.source.parent.isAttacker,
                onDefendersDeclared: (event, context) => {
                    return event.attack.battles.some((b) => b.guard === context.source.parent);
                }
            },
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.player.phoenixborn,
                amount: 1
            }))
        });

        this.forcedInterrupt({
            autoResolve: true,
            inexhaustible: true,
            when: {
                onCardLeavesPlay: (event, context) =>
                    event.triggeringEvent &&
                    event.triggeringEvent.name === 'onCardDestroyed' &&
                    event.card === context.source.parent
            },
            targetController: 'any',
            target: {
                toSelect: 'player',
                autoTarget: (context) => context.player.opponent,
                gameAction: ability.actions.summon((context) => ({
                    conjuration: 'blood-puppet',
                }))
            }
        });
    }
}

Playtime.id = 'playtime';

module.exports = Playtime;
