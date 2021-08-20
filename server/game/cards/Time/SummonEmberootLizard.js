const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonEmberootLizard extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Emberoot Lizard',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Natural)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'emberoot-lizard'
            })
        });
    }
}

SummonEmberootLizard.id = 'summon-emberoot-lizard';

module.exports = SummonEmberootLizard;
