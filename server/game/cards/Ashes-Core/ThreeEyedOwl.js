const Card = require('../../Card.js');

class ThreeEyedOwl extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Memory Drain 1',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            gameAction: ability.actions.chosenDiscard({ player: this.controller.opponent })
        });
    }
}

ThreeEyedOwl.id = 'three-eyed-owl';

module.exports = ThreeEyedOwl;
