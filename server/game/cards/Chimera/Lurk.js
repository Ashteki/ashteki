const { Level } = require("../../../constants");
const AspectCard = require("../../solo/AspectCard");

class Lurk extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.concealed();

        this.persistentEffect({
            effect: ability.effects.quickStrike()
        });

    }
}

Lurk.id = 'lurk';

module.exports = Lurk