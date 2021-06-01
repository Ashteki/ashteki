const Card = require('../../Card.js');

class RaptorHerder extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.summon({
                conjuration: 'raptor-hatchling'
            })
        });
    }
}

RaptorHerder.id = 'raptor-herder';

module.exports = RaptorHerder;
