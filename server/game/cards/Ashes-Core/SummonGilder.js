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
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'gilder',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                target: {
                    optional: true,
                    activePromptTitle: 'Deal 1 damage',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage()
                }
            }
        });
    }
}

SummonGilder.id = 'summon-gilder';

module.exports = SummonGilder;
