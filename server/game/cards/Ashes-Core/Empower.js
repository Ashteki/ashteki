const { BattlefieldTypes, Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class Empower extends Card {
    setupCardAbilities(ability) {
        this.action({
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    [
                        // parallel cost
                        new DiceCount(1, Level.Class, Magic.Sympathy),
                        new DiceCount(1, Level.Class, Magic.Natural)
                    ]
                ])
            ],
            gameAction: ability.actions.addStatusToken(() => ({
                promptForSelect: {
                    optional: true,
                    controller: 'self',
                    cardCondition: (card, context) => card !== context.source,
                    activePromptTitle: 'Choose a unit to empower',
                    cardType: [...BattlefieldTypes]
                }
            }))
        });
    }
}

Empower.id = 'gilder';

module.exports = Empower;
