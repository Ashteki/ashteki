const Card = require('../../Card.js');

class GatewayToDis extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy all creatures and gain 3 chains',
            gameAction: [
                ability.actions.destroy((context) => ({ target: context.game.creaturesInPlay }))
            ]
        });
    }
}

GatewayToDis.id = 'gateway-to-dis';

module.exports = GatewayToDis;
