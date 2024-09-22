const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonShadeProwler extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Shade Prowler',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Illusion),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'shade-prowler'
            })
        });
    }
}

SummonShadeProwler.id = 'summon-shade-prowler';

module.exports = SummonShadeProwler;
