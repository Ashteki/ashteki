const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SunshieldSentry extends Card {
    setupCardAbilities(ability) {
        this.alert();

        this.reaction({
            title: 'Deflect',
            when: {
                onDefendersDeclared: (event, context) => {
                    return (
                        event.attack.attackingPlayer === context.source.owner.opponent &&
                        event.attack.isPBAttack &&
                        context.source.isDefender &&
                        event.attack.battles.some((battle) => !battle.guard)
                    );
                }
            },
            effect: 'remove {1} from battle',
            effectArgs: (context) => context.target,
            target: {
                optional: true,
                cardCondition: (card) => card.isAttacker,
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.removeFromBattle()
            }
        });
    }
}

SunshieldSentry.id = 'sunshield-sentry';

module.exports = SunshieldSentry;
