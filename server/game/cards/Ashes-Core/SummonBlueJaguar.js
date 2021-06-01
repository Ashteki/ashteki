const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonBlueJaguar extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Blue Jaguar',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(2, Level.Basic)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'blue-jaguar'
            })
        });
    }
}

SummonBlueJaguar.id = 'summon-blue-jaguar';

module.exports = SummonBlueJaguar;
