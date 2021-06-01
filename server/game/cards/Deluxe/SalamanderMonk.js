const Card = require('../../Card.js');

class SalamanderMonk extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            inexhaustible: true,
            gameAction: ability.actions.summon({
                conjuration: 'salamander-monk-spirit'
            })
        });
    }
}

SalamanderMonk.id = 'salamander-monk';

module.exports = SalamanderMonk;
