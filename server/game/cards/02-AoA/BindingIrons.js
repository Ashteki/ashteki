const Card = require('../../Card.js');

class BindingIrons extends Card {
    setupCardAbilities() {
        this.play();
    }
}

BindingIrons.id = 'binding-irons';

module.exports = BindingIrons;
