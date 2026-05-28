const { CardType, Level, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SearingBolt extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a card to deal 2 damage to',
                showCancel: true,
                cardType: BattlefieldTypes,
                controller: 'opponent',
                cardCondition: (card) => card.life === card.owner.getHighestUnitLife(),
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

SearingBolt.id = 'searing-bolt';

module.exports = SearingBolt;
