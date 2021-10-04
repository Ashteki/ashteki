const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class LickWounds extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                gameAction: [
                    ability.actions.removeDamage({ amount: 2 }),
                    ability.actions.removeExhaustion()
                ]
            }
        });
    }
}

LickWounds.id = 'lick-wounds';

module.exports = LickWounds;
