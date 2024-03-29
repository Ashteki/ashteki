const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class Hollow extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Hex 2',
            target: {
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'upTo',
                numDice: 2,
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            },
            message: '{0} uses {1} to lower up to 2 opponent dice'
        });
    }
}

Hollow.id = 'hollow';

module.exports = Hollow;
