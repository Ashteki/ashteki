const Card = require('../../Card.js');

class Choke extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Choke',
            getWarnings: (context) =>
                context.player.opponent.phoenixborn.exhausted &&
                "Your opponent's phoenixborn is exhausted.",
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                cardCondition: (card) => !card.exhausted,
                gameAction: [
                    ability.actions.dealDamage(),
                    ability.actions.exhaust({ showMessage: true })
                ]
            }
        });
    }
}

Choke.id = 'choke';

module.exports = Choke;
