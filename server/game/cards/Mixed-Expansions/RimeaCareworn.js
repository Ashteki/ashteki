const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class RimeaCareworn extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Visions',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            gameAction: ability.actions.draw({ amount: 2 }),
            then: {
                target: {
                    toSelect: 'player',
                    autoTarget: (context) => context.player.opponent,
                    gameAction: ability.actions.exposeRandom({ promptTitle: 'Visions', amount: 2 })
                }
            }
        });
    }
}

RimeaCareworn.id = 'rimea-careworn';

module.exports = RimeaCareworn;
