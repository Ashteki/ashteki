const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class HuntingWeapons extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyAttack(1), ability.effects.addKeyword({ hunt: 1 })]
        });
    }

    canAttach(card, context) {
        const myCondition = card.type === CardType.Ally;
        return super.canAttach(card, context) && myCondition;
    }
}

HuntingWeapons.id = 'hunting-weapons';

module.exports = HuntingWeapons;
