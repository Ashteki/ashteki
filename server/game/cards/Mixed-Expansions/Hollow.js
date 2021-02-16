const Card = require('../../Card.js');

class Hollow extends Card {
    setupCardAbilities() {
        this.play({
            title: 'Hex 2',
            target: {
                toSelect: 'die',
                mode: 'upTo',
                numDice: 2,
                owner: 'opponent',
                gameAction: this.game.actions.lowerDie()
            },
            message: '{0} uses {1} to lower up to 2 opponent dice'
        });
    }
}

Hollow.id = 'hollow';

module.exports = Hollow;
