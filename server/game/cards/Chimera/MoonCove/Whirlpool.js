const AspectCard = require('../../../solo/AspectCard');

class Whirlpool extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'last',
            target: {
                autoTarget: (context) =>
                    context.player.opponent.unitsInPlay.filter((u) => !u.exhausted),
                gameAction: ability.actions.conditional({
                    condition: (context) => context.source.status === 0,
                    trueGameAction: ability.actions.exhaust({ showMessage: true })
                })
            }
        });
    }
}

Whirlpool.id = 'whirlpool';

module.exports = Whirlpool;
