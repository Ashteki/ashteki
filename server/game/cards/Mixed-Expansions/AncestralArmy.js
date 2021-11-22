const Card = require('../../Card.js');

class AncestralArmy extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.summon({
                conjuration: 'ancestor-spirit',
                count: 2
            })
        });
    }
}

AncestralArmy.id = 'ancestral-army';

module.exports = AncestralArmy;
