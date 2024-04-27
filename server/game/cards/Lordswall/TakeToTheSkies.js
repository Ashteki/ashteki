const Card = require('../../Card.js');

class TakeToTheSkies extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Take to the Skies',
            condition: (context) => context.player.phoenixborn.exhausted,
            gameAction: ability.actions.summon({
                conjuration: 'divinity-mount'
            })
        });
    }
}

TakeToTheSkies.id = 'take-to-the-skies';

module.exports = TakeToTheSkies;
