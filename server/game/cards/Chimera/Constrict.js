const { Level } = require("../../../constants");
const AspectCard = require("../../solo/AspectCard");

class Constrict extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.defender()
    }
}

Constrict.id = 'constrict';

module.exports = Constrict