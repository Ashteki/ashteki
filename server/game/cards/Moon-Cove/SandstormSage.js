const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class SandstormSage extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.type === CardType.ReadySpell && card.controller === this.controller,
            effect: ability.effects.modifyFocus(1)
        });
    }
}

SandstormSage.id = 'sandstorm-sage';

module.exports = SandstormSage;
