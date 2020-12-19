const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonDreadWraith extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Dread Wraith',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(3, Level.Class, Magic.Ceremonial)])
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'dread-wraith',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                condition: () => this.focus === 2,
                gameAction: ability.actions.removeExhaustion((context) => ({
                    amount: 1,
                    target: context.player.cardsInPlay.filter((c) => c.id === 'dread-wraith')
                }))
            }
        });
    }
}

SummonDreadWraith.id = 'summon-dread-wraith';

module.exports = SummonDreadWraith;
