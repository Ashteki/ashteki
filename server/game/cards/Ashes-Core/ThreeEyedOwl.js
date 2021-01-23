const Card = require('../../Card.js');

class ThreeEyedOwl extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Memory Drain 1',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            target: {
                mode: 'player',
                activePromptTitle: 'Which player discards?',
                gameAction: ability.actions.chosenDiscard()
            }
        });
    }
}

ThreeEyedOwl.id = 'three-eyed-owl';

module.exports = ThreeEyedOwl;
