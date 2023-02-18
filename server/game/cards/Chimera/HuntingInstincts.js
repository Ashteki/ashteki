const Card = require("../../Card");

class HuntingInstincts extends Card {
    setupCardAbilities(ability) {
        this.alert();

    }

}

HuntingInstincts.id = 'hunting-instincts';

module.exports = HuntingInstincts