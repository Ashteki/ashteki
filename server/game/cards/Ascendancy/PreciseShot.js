const { BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class PreciseShot extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Align',
            condition: (context) => context.source.isCharged,
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            target: {
                activePromptTitle: 'Choose a card to deal 1 damage to',
                cardType: [...BattlefieldTypes, ...PhoenixbornTypes],
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            }
        });
    }
}

PreciseShot.id = 'precise-shot';

module.exports = PreciseShot;
