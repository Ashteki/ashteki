const AspectCard = require('../../../solo/AspectCard');

class CarrionCall extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            gameAction: ability.actions.conditional({
                condition: (context) => context.source.status === 0,
                trueGameAction: ability.actions.summon({
                    conjuration: 'rainwalker',
                    count: 3
                })
            })
        });
    }

    get statusCount() {
        return 2;
    }
}

CarrionCall.id = 'carrion-call';

module.exports = CarrionCall;
