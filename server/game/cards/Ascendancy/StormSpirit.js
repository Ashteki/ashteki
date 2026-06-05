const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class StormSpirit extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Hex 1',
            target: {
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'upTo',
                numDice: 1,
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            },
            message: '{0} uses {1} to lower 1 opponent die'
        });
    }
}

StormSpirit.id = 'storm-spirit';

module.exports = StormSpirit;
