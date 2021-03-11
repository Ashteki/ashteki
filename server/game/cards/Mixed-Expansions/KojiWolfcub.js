const Card = require('../../Card.js');

class KojiWolfcub extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Accelerate Growth',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                gameAction: ability.actions.addStatusToken()
            }
        });
    }
}

KojiWolfcub.id = 'koji-wolfcub';

module.exports = KojiWolfcub;
