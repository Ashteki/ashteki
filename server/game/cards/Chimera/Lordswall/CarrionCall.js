const AspectCard = require('../../../solo/AspectCard');

class CarrionCall extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'last',
            gameAction: ability.actions.conditional({
                condition: (context) => context.source.status === 0,
                trueGameAction: ability.actions.summon({
                    conjuration: 'rainwalker',
                    count: 3
                })
            })
        });
    }
}

CarrionCall.id = 'carrion-call';

module.exports = CarrionCall;
