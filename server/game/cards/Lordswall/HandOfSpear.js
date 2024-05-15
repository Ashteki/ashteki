const Card = require('../../Card.js');

class PteraHerder extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.summon({
                conjuration: 'hand-of-shield'
            })
        });

        this.persistentEffect({
            effect: ability.effects.quickStrike()
        });
    }
}

PteraHerder.id = 'hand-of-spear';

module.exports = PteraHerder;
