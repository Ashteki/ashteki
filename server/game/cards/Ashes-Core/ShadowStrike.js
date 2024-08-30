const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class ShadowStrike extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent &&
                    event.attackingPlayer.unitsInPlay.some((c) => !event.attackers.includes(c))
            },
            effect: 'deal 3 damage to a non-attacker',
            target: {
                cardType: BattlefieldTypes,
                controller: 'opponent',
                cardCondition: (card, context) => !context.event.attackers.includes(card),
                gameAction: ability.actions.dealDamage({ amount: 3 })
            }
        });
    }
}

ShadowStrike.id = 'shadow-strike';

module.exports = ShadowStrike;
