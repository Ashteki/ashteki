const AspectCard = require('../../../solo/AspectCard');

class DeepEnd extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.concealed({
            condition: () =>
                !this.exhausted &&
                this.controller.opponent.phoenixborn.getKeywordValue('drowning') > 2
        });
    }
}

DeepEnd.id = 'deep-end';

module.exports = DeepEnd;
