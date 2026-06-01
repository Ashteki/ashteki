const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonCapacitorBeetle extends Card {
    setupCardAbilities(ability) {
        this.summon('capacitor-beetle', {
            title: 'Summon Capacitor Beetle',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Power, Magic.Artifice)])
            ],
            location: 'spellboard',
            then: {
                condition: (context) => context.source.isCharged,
                gameAction: ability.actions.draw()
            }
        });
    }
}

SummonCapacitorBeetle.id = 'summon-capacitor-beetle';

module.exports = SummonCapacitorBeetle;
