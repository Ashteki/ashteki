const { Level } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class ChargeFist extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedReaction({
            inexhaustible: true,
            when: {
                // it's my turn
                onBeginTurn: (event, context) => event.player === context.player
            },
            location: 'play area',
            cost: [ability.costs.loseStatus(1)],
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.conditional({
                    condition: (context) => context.source.status === 0,

                    trueGameAction: ability.actions.dealDamage({ amount: 3 })
                })
            },
            then: {
                condition: (context) => context.source.status === 0,
                target: {
                    toSelect: 'die',
                    autoTarget: (context) => context.player.opponent.dice.filter((d) => d.level !== Level.Basic),
                    gameAction: ability.actions.rerollDice()
                }
            }
        });
    }

    get statusCount() {
        return 3;
    }
}

ChargeFist.id = 'charge-fist';

module.exports = ChargeFist;
