const AspectCard = require("../../../solo/AspectCard");

class Broodmother extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'last',
            gameAction: ability.actions.conditional({
                condition: (context) => context.source.status === 0,
                trueGameAction: ability.actions.addToThreatZone({ amount: 1 })
            })
        });
    }
}

Broodmother.id = 'broodmother';

module.exports = Broodmother;
