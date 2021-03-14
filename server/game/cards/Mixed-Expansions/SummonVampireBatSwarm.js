const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonVampireBatSwarm extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Vampire Bat Swarm',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Ceremonial),
                    new DiceCount(1, Level.Class, Magic.Sympathy)
                ])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'vampire-bat-swarm',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonVampireBatSwarm.id = 'summon-vampire-bat-swarm';

module.exports = SummonVampireBatSwarm;
