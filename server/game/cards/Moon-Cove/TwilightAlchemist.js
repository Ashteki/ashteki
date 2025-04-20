const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class TwilightAlchemist extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            shortMessage: true,
            target: {
                optional: true,
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
                gameAction: ability.actions.draw({ amount: 2, showMessage: true }),
                then: {
                    alwaysTriggers: true,
                    target: {
                        toSelect: 'die',
                        mode: 'upTo',
                        numDice: 2,
                        dieCondition: (die) => !die.exhausted && die.level !== Level.Power,
                        owner: 'self',
                        activePromptTitle: 'Choose up to 2 dice to raise one level',
                        gameAction: ability.actions.raiseDie({ showMessage: true })
                    }
                }
            }
        });
    }
}

TwilightAlchemist.id = 'twilight-alchemist';

module.exports = TwilightAlchemist;
