const { PhoenixbornTypes } = require('../../../../constants.js');
const Card = require('../../../Card.js');

class Stun extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.exhausted()]
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
