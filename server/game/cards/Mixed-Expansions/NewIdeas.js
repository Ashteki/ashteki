const Card = require('../../Card.js');

class NewIdeas extends Card {
    setupCardAbilities(ability) {
        this.play({
            shortMessage: true,
            target: {
                activePromptTitle: 'Choose a card to return to your deck',
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.returnToDeck({
                    bottom: true,
                    reveal: false,
                    shuffle: false
                })
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
