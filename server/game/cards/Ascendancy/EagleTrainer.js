const Card = require('../../Card.js');

class EagleTrainer extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.summon({
                conjuration: 'eagle-fledgling'
            })
        });
    }
}

EagleTrainer.id = 'eagle-trainer';

module.exports = EagleTrainer;
