const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class BloodPuppet extends Card {
    setupCardAbilities(ability) {
        // end of round wounds pb
        this.forcedInterrupt({
            title: 'Cursed 1',
            when: {
                onRoundEnded: () => true
            },
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.source.owner.phoenixborn
            }))
        });

        // side action
        this.action({
            title: 'Self Inflict',
            cost: [ability.costs.sideAction(), ability.costs.dice([new DiceCount(1, Level.Basic)])],
            gameAction: ability.actions.dealDamage({ target: this })
        });
    }
}

BloodPuppet.id = 'blood-puppet';

module.exports = BloodPuppet;
