const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Safeguard extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.preventAllDamage(this),
                    turnDuration: 2
                })
            }
        });
    }
}

Safeguard.id = 'safeguard';

module.exports = Safeguard;
