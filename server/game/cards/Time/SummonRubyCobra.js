const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonRubyCobra extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Ruby Cobra',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Power, Magic.Charm)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'ruby-cobra'
            })
        });
    }
}

SummonRubyCobra.id = 'summon-ruby-cobra';

module.exports = SummonRubyCobra;
