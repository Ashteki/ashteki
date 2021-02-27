const Card = require('../../Card.js');

class MagicSyphon extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Magic Syphon',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            gameAction: ability.actions.changeDice({
                multiSelect: true, // fudge for an upTo selector
                numDice: 1,
                owner: 'self'
            }),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.changeDice({
                    numDice: 1,
                    owner: 'any'
                })
            }
        });
    }
}

MagicSyphon.id = 'magic-syphon';

module.exports = MagicSyphon;
