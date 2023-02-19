const { BattlefieldTypes, CardType, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ChangeOfHeart extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('use')
        });

        this.action({
            title: 'Change of heart',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                controller: 'self',
                activePromptTitle: 'Choose a unit to return to hand',
                cardType: CardType.Ally,
                gameAction: ability.actions.returnToHand()
            },
            then: {
                target: {
                    activePromptTitle: 'Choose a unit to deal 1 damage to',
                    controller: 'opponent',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage({ amount: 1 })
                }
            }
        });
    }

    canAttach(card, context) {
        return card && PhoenixbornTypes.includes(card.getType())
            && !card.exhausted
            && this.canPlayAsUpgrade();
    }
}

ChangeOfHeart.id = 'change-of-heart';

module.exports = ChangeOfHeart;
