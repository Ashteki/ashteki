const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonSalamanderMonk extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Salamander Monk',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Sympathy)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'salamander-monk'
            })
        });
    }
}

SummonSalamanderMonk.id = 'summon-salamander-monk';

module.exports = SummonSalamanderMonk;
