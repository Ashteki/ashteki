const AspectCard = require('../../solo/AspectCard');

class Constrict extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: 'Constrict 1',
            gameAction: ability.actions.chosenExhaust((context) => ({
                target: context.player.opponent
            }))
        });

        this.defender();
    }
}

Constrict.id = 'constrict';

module.exports = Constrict