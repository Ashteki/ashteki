const Card = require('../../Card.js');

class HideoutWatch extends Card {
    setupCardAbilities(ability) {
        this.hidden();

        this.entersPlay({
            title: 'Poised 2',
            gameAction: ability.actions.changeDice({
                dieCondition: (die) => !die.exhausted,
                numDice: 2,
                owner: 'self'
            })
        });
    }
}

HideoutWatch.id = 'hideout-watch';

module.exports = HideoutWatch;
