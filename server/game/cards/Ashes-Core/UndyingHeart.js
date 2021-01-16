const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class UndyingHeart extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            inexhaustible: true,
            effect: [
                ability.effects.gainAbility('destroyed', {
                    effect: 'return {0} to hand',
                    condition: (context) => {
                        return context.source.type === CardType.Ally;
                    },
                    gameAction: ability.actions.returnToHand()
                }),
                ability.effects.modifyLife(1),
                ability.effects.modifyRecover(1)
            ]
        });
    }
}

UndyingHeart.id = 'undying-heart';

module.exports = UndyingHeart;
