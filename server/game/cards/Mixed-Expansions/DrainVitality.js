const { BattlefieldTypes, Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class DrainVitality extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Damage',
            location: 'spellboard',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Ceremonial)])
            ],
            target: {
                activePromptTitle: 'Choose a card to damage',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage()
            },
            then: {
                target: {
                    activePromptTitle: 'Choose a card to remove a wound',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.removeDamage({ showMessage: true })
                }
            }
        });

        this.action({
            title: 'Status',
            location: 'spellboard',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Sympathy)])
            ],
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.removeStatus()
            },
            then: {
                target: {
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.addStatusToken({ showMessage: true })
                }
            }
        });
    }
}

DrainVitality.id = 'drain-vitality';

module.exports = DrainVitality;
