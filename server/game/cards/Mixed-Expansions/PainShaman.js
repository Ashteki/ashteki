const Card = require('../../Card.js');
const { BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');

class PainShaman extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                optional: true,
                activePromptTitle: 'Choose a unit to damage',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose a unit or Phoenixborn to remove a wound from',
                    cardType: [...BattlefieldTypes, ...PhoenixbornTypes],
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
