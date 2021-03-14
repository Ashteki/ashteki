const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class VampireBatSwarm extends Card {
    setupCardAbilities(ability) {
        this.groupTactics({ amount: 1 });

        this.destroyed({
            cost: ability.costs.dice([
                [
                    new DiceCount(1, Level.Class, Magic.Ceremonial),
                    new DiceCount(1, Level.Class, Magic.Sympathy)
                ]
            ]),
            gameAction: ability.actions.putIntoPlay({
                target: this
            })
        });
    }
}

VampireBatSwarm.id = 'vampire-bat-swarm';

module.exports = VampireBatSwarm;
