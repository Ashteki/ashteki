const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Safeguard extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    effect: ability.effects.preventAllDamage(
                        this,
                        (context, effectContext) => context.player === effectContext.player.opponent
                    ),
                    until: {
                        onBeginTurn: (event) => event.player === context.player
                    }
                }))
            }
        });
    }
}

Safeguard.id = 'safeguard';

module.exports = Safeguard;
