const AspectCard = require('../../../solo/AspectCard');

class ChargeFist extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'last',
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
                    autoTarget: (context) => context.player.opponent.activeNonBasicDice,
                    gameAction: ability.actions.rerollDice()
                }
            }
        });
    }
}

ChargeFist.id = 'charge-fist';

module.exports = ChargeFist;
