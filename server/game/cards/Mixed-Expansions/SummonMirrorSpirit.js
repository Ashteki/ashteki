const { Level, Magic, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonMirrorSpirit extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Mirror Spirit',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(2, Level.Class, Magic.Sympathy),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'mirror-spirit',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                condition: () => this.focus > 0,
                target: {
                    cardCondition: (card) => card.id === 'mirror-spirit',
                    controller: 'self',
                    gameAction: ability.actions.removeStatus({ amount: 'all' })
                },
                then: {
                    target: {
                        cardType: BattlefieldTypes,
                        gameAction: ability.actions.exhaust()
                    }
                }
            }
        });
    }
}

SummonMirrorSpirit.id = 'summon-mirror-spirit';

module.exports = SummonMirrorSpirit;
