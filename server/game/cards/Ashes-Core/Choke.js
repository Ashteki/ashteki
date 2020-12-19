const Card = require('../../Card.js');

class Choke extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Choke',
            gameAction: [
                ability.actions.dealDamage((context) => ({
                    target: context.source.owner.opponent.phoenixborn
                })),
                ability.actions.exhaust((context) => ({
                    target: context.source.owner.opponent.phoenixborn
                }))
            ]
        });
    }
}

Choke.id = 'choke';

module.exports = Choke;
