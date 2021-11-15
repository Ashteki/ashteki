const { Level, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class JessaNaNi extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Screams of the Departed',
            when: {
                onCardDestroyed: (event) => BattlefieldTypes.includes(event.card.type)
            },
            limit: ability.limit.perTurn(1),
            cost: ability.costs.dice([new DiceCount(1, Level.Basic)]),
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.player.opponent.phoenixborn
            }))
        });
    }
}

JessaNaNi.id = 'jessa-na-ni';

module.exports = JessaNaNi;
