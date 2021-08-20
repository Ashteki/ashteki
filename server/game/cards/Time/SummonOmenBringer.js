const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonOmenBringer extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Omen Bringer',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Time),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'omen-bringer'
            })
        });
    }
}

SummonOmenBringer.id = 'summon-omen-bringer';

module.exports = SummonOmenBringer;
