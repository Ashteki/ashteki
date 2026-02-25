const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class ThunderSuit extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyAttack(2),
                ability.effects.modifyLife(2),
                ability.effects.modifyRecover(1)
            ]
        });

        this.forcedReaction({
            when: {
                onCardAttached: (event, context) => event.card === context.source
            },
            target: {
                toSelect: 'die',
                autoTarget: (context) =>
                    context.player.findDie((die) => die.magic === Magic.Artifice && die.exhausted),
                gameAction: ability.actions.resolveDieAbility((context) => ({
                    targetCard: context.source.parent
                }))
            }
        });
    }
}

ThunderSuit.id = 'thunder-suit';

module.exports = ThunderSuit;
