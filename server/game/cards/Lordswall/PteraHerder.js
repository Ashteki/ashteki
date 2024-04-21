const Card = require('../../Card.js');

class PteraHerder extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.summon({
                conjuration: 'ptera-hatchling'
            })
        });
    }
}

PteraHerder.id = 'ptera-herder';

module.exports = PteraHerder;
