const { BattlefieldTypes, Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonGilder extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Gilder',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Natural)])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'gilder',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    optional: true,
                    activePromptTitle: 'Deal 1 damage',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage()
                },
                message: '{0} uses {1} to deal 1 damage to {2}',
                messageArgs: (context) => context.target
            }
        });
    }
}

SummonGilder.id = 'summon-gilder';

module.exports = SummonGilder;
