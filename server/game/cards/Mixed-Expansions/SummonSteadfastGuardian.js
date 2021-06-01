const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonSteadfastGuardian extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Steadfast Guardian',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Charm),
                    new DiceCount(1, Level.Class, Magic.Divine)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'steadfast-guardian'
            }),
            then: {
                condition: () => this.focus > 0,
                target: {
                    controller: 'self',
                    cardCondition: (card) => card.id === 'steadfast-guardian',
                    gameAction: [
                        ability.actions.removeDamage({
                            all: true
                        }),
                        ability.actions.removeExhaustion({
                            all: true
                        })
                    ]
                }
            }
        });
    }
}

SummonSteadfastGuardian.id = 'summon-steadfast-guardian';

module.exports = SummonSteadfastGuardian;
