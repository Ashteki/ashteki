const { Level, Magic, BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class BloodTransfer extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Blood Transfer',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Ceremonial),
                    new DiceCount(1, Level.Class, Magic.Charm)
                ])
            ],
            location: 'spellboard',
            targets: {
                first: {
                    activePromptTitle: 'Choose a unit to wound',
                    controller: 'self',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                },
                second: {
                    activePromptTitle: 'Choose a card to remove a wound from',
                    optional: true,
                    dependsOn: 'first',
                    controller: 'self',
                    cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                    gameAction: ability.actions.removeDamage((context) => ({
                        amount: context.targets.second.type === CardType.Phoenixborn ? 1 : 2,
                        showMessage: true
                    }))
                }
            }
        });
    }
}

BloodTransfer.id = 'blood-transfer';

module.exports = BloodTransfer;
