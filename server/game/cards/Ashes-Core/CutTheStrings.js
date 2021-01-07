const { Level, Magic, BattlefieldTypes, UpgradeCardTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class CutTheStrings extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Cut the Strings',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Ceremonial),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            target: {
                activePromptTitle: 'Choose a unit to damage',
                controller: 'self',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage({
                    amount: 2
                })
            },
            then: {
                target: {
                    optional: true,
                    activePromptTitle: 'Choose an alteration',
                    cardType: UpgradeCardTypes,
                    gameAction: ability.actions.discard()
                }
            }
        });
    }
}

CutTheStrings.id = 'cut-the-strings';

module.exports = CutTheStrings;
