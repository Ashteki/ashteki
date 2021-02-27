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
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'steadfast-guardian',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                condition: () => this.focus > 0,
                target: {
                    controller: 'self',
                    cardCondition: (card) => card.id === 'steadfast-guardian',
                    gameAction: ability.actions.removeDamage({
                        all: true
                    })
                }
            }
        });
    }
}

SummonSteadfastGuardian.id = 'summon-ice-golem';

module.exports = SummonSteadfastGuardian;
