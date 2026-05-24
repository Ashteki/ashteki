const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class Strengthen extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Strengthen a unit',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            target: {
                showCancel: true,
                cardType: BattlefieldTypes,
                cardCondition: (card, context) =>
                    // bot rules for play - don't exhaust own units
                    !context.player.isBot || card.controller === context.player.opponent,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(context.source.focus >= 2 ? 3 : 2)
                }))
            }
        });
    }
}

Strengthen.id = 'strengthen';

module.exports = Strengthen;
