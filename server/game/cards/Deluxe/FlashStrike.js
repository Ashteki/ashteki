const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FlashStrike extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDefendersDeclared: (event, context) =>
                    event.attack.attackingPlayer === context.source.owner
            },
            target: {
                controller: 'self',
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.status >= 1,
                gameAction: ability.actions.cardLastingEffect(() => ({
                    duration: 'untilEndOfTurn',
                    effect: [ability.effects.quickStrike(), ability.effects.modifyAttack(2)]
                }))
            },
            getWarnings: (context) => this.getWarnings(context)
        });

    }

    getWarnings(context) {
        if (!context.game.attackState.attackers.some(a => a.status)) {
            return 'You don\'t have attackers with status tokens';
        }
    }
}

FlashStrike.id = 'flash-strike';

module.exports = FlashStrike;
