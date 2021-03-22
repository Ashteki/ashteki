const Card = require('../../Card.js');

class MindMaze extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.cardCannot('attack'),
                ability.effects.cardCannot('block'),
                ability.effects.cardCannot('guard')
            ]
        });

        this.action({
            inexhaustible: true,
            title: 'Escape',
            cost: [
                ability.costs.mainAction(),
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.chosenDiscard()
            ],
            gameAction: ability.actions.discard({ target: this })
        });

        this.forcedReaction({
            inexhaustible: true,
            title: 'Lost',
            when: {
                onRoundEnded: () => true
            },
            gameAction: ability.actions.discard()
        });
    }
}

MindMaze.id = 'mind-maze';

module.exports = MindMaze;
