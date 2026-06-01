const Card = require('../../Card.js');

class Snaptrap extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Solar bloom',
            cost: ability.costs.mainAction(),
            gameAction: ability.actions.discard(),
            then: {
                condition: (context) => context.preThenEvent.clone.wasCharged,
                gameAction: ability.actions.summon({
                    conjuration: 'floral-tyrant'
                })
            }
        });
    }
}

Snaptrap.id = 'snaptrap';

module.exports = Snaptrap;
