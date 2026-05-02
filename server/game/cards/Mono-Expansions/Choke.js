const Card = require('../../Card.js');

class Choke extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Choke',
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

    playWarning(context) {
        if (context.player.opponent.phoenixborn.exhausted) {
            return "Your opponent's phoenixborn is exhausted.";
        }
    }
}

Choke.id = 'choke';

module.exports = Choke;
