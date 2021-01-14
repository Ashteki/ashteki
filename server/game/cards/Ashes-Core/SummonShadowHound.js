const { BattlefieldTypes, Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonShadowHound extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Shadow Hound',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(3, Level.Class, Magic.Illusion)])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'shadow-hound',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                condition: () => this.focus > 0,
                target: {
                    optional: true,
                    activePromptTitle: 'Deal 1 damage',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage()
                },
                then: {
                    condition: () => this.focus === 2,
                    target: {
                        optional: true,
                        activePromptTitle: 'Deal 1 damage',
                        cardType: BattlefieldTypes,
                        gameAction: ability.actions.dealDamage()
                    }
                }
            }
        });
    }
}

SummonShadowHound.id = 'summon-shadow-hound';

module.exports = SummonShadowHound;
