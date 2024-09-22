const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonScrawler extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Scrawler',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'scrawler'
            })
        });
    }
}

SummonScrawler.id = 'summon-scrawler';

module.exports = SummonScrawler;
