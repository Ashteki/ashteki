const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class Purge extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Purge',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.die(new DiceCount(1, Level.Class, Magic.Charm))
            ],
            location: 'spellboard',
            gameAction: ability.actions.discardTopOfDeck({ player: this.controller.opponent }),
            then: (context) => ({
                condition: context.source.focus > 0,
                cost: ability.costs.dice([new DiceCount(1, Level.Basic)]),
                gameAction: ability.actions.discardTopOfDeck({ player: this.controller.opponent })
            })
        });
    }
}

Purge.id = 'purge';

module.exports = Purge;
