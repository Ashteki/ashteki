const { BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Safeguard extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: [...BattlefieldTypes, ...PhoenixbornTypes],
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
