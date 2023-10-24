const { PhoenixbornTypes } = require('../../../../constants.js');
const Card = require('../../../Card.js');

class Stun extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.exhausted()]
        });

        this.action({
            title: 'Unstun',
            cost: ability.costs.sideAction(),
            gameAction: ability.actions.discard({ target: this })
        });
    }

    canAttach(card, context) {
        return (
            (card && PhoenixbornTypes.includes(card.getType()) && this.canPlayAsUpgrade()) ||
            super.canAttach(card, context)
        );
    }
}

Stun.id = 'stun';

module.exports = Stun;
