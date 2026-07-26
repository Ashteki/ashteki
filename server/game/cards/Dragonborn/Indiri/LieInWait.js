const AspectCard = require('../../../solo/AspectCard');

class LieInWait extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.concealed();
        this.persistentEffect({
            effect: ability.effects.unseen()
        });
    }
}

LieInWait.id = 'lie-in-wait';

module.exports = LieInWait;
