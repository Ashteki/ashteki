const Card = require('../../Card.js');

class PhoenixAttendant extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Alleviate 1',
            cost: [ability.costs.sideAction()],
            condition: (context) => context.source.damage < 1,
            gameAction: ability.actions.moveToken((context) => ({
                from: context.player.phoenixborn,
                to: context.source,
                type: 'damage'
            }))
        });
    }
}

PhoenixAttendant.id = 'phoenix-attendant';

module.exports = PhoenixAttendant;
