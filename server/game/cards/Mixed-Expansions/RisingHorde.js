const Card = require('../../Card.js');

class RisingHorde extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            title: 'Raise Fallen',
            inexhaustible: true,
            gameAction: ability.actions.summon({
                conjuration: 'fallen',
                count: 2
            })
        });
    }
}

RisingHorde.id = 'rising-horde';

module.exports = RisingHorde;
