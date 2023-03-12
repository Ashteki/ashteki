const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class PhoenixAttendant extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Alleviate 1',
            cost: [ability.costs.sideAction()],
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
