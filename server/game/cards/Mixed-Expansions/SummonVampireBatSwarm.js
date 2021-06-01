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
            gameAction: ability.actions.summon({
                conjuration: 'vampire-bat-swarm'
            })
        });
    }
}

SummonVampireBatSwarm.id = 'summon-vampire-bat-swarm';

module.exports = SummonVampireBatSwarm;
