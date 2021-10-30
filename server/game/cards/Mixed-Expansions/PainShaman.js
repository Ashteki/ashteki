const Card = require('../../Card.js');
const { BattlefieldTypes, CardType } = require('../../../constants.js');

class PainShaman extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            effect: 'deal 1 damage to {0}',
            target: {
                optional: true,
                activePromptTitle: 'Choose a unit to damage',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage()
            },
            then: {
                target: {
                    activePromptTitle: 'Choose a unit or Phoenixborn to remove a wound from',
                    cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                    optional: true,
                    gameAction: ability.actions.removeDamage({
                        showMessage: true
                    })
                }
            }
        });
    }
}

PainShaman.id = 'pain-shaman';

module.exports = PainShaman;
