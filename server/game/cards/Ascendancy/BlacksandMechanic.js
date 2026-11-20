const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class BlacksandMechanic extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Tinker 2',
            may: 'discard an alteration spell to draw 2 cards',
            condition: (context) => context.player.hasCardTypeInHand(CardType.Upgrade),
            cost: ability.costs.chosenDiscard(1, true, CardType.Upgrade),
            gameAction: ability.actions.draw({ amount: 2 })
        });

        this.action({
            title: 'Repair 1',
            cost: ability.costs.sideAction(),
            target: {
                activePromptTitle: 'Choose a unit to remove 1 damage from',
                controller: 'self',
                cardType: BattlefieldTypes,
                cardCondition: (card) =>
                    card.damage > 0 && (card.upgrades.length > 0 || card.isCharged),
                gameAction: ability.actions.removeDamage({ amount: 1 })
            }
        });
    }
}

BlacksandMechanic.id = 'blacksand-mechanic';

module.exports = BlacksandMechanic;
