const Card = require('../../Card.js');

class MoonMoth extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();
    }
}

MoonMoth.id = 'moon-moth';

module.exports = MoonMoth;
