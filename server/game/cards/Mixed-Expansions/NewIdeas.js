const Card = require('../../Card.js');

class NewIdeas extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.moveToBottom()
            },
            then: {
                gameAction: ability.actions.draw({ amount: 3 }),
                message: '{0} draws 3 cards'
            }
        });
    }
}

NewIdeas.id = 'new-ideas';

module.exports = NewIdeas;
