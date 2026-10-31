const AspectCard = require('../../../solo/AspectCard');

class Convert extends AspectCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.unpreventable()
        });

        this.afterDestroysFighting({
            autoResolve: true,
            gameAction: ability.actions.summon({
                conjuration: 'rainwalker'
            })
        });
    }
}

Convert.id = 'convert';

module.exports = Convert;
