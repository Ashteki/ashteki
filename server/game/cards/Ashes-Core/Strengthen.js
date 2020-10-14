const Card = require('../../Card.js');

class Strengthen extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Strengthen a unit',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            target: {
                cardType: ['Ally', 'Conjuration'],
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(2)
                })
            }
        });
    }
}

Strengthen.id = 'strengthen';

module.exports = Strengthen;
