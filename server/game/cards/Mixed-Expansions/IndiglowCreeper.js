const Card = require('../../Card.js');

class IndiglowCreeper extends Card {
    setupCardAbilities(ability) {
        this.fade();

        this.destroyed({
            inexhaustible: true,
            gameAction: ability.actions.summon({
                conjuration: 'luminous-seedling'
            })
        });
    }
}

IndiglowCreeper.id = 'indiglow-creeper';

module.exports = IndiglowCreeper;
