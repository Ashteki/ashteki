const Card = require('../../Card.js');

class TuskMount extends Card {
    setupCardAbilities(ability) {
        this.dismount();

        this.afterDestroysFighting({
            gameAction: ability.actions.summon({
                conjuration: 'rubble-spirit',
                count: 2
            })
        });
    }
}

TuskMount.id = 'tusk-mount';

module.exports = TuskMount;
