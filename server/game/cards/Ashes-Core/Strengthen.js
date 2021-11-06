const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class Strengthen extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Strengthen a unit',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            target: {
                cardType: BattlefieldTypes,
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
