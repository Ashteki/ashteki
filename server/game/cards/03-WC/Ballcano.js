const Card = require('../../Card.js');

class Ballcano extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 4 damage to all creatures, gaining 2 chains',
            gameAction: [
                ability.actions.dealDamage((context) => ({
                    amount: 4,
                    target: context.game.creaturesInPlay
                }))
            ]
        });
    }
}

Ballcano.id = 'ballcano';

module.exports = Ballcano;
