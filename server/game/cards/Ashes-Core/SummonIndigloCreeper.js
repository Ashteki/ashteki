const { Level, Magic, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonIndigloCreeper extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Indiglo Creeper',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Natural),
                    new DiceCount(1, Level.Class, Magic.Sympathy)
                ])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'indiglo-creeper',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                condition: () => this.focus >= 1,
                gameAction: ability.actions.addStatus({
                    promptForSelect: {
                        cardType: BattlefieldTypes,
                        controller: 'self'
                    }
                })
            }
        });
    }
}

SummonIndigloCreeper.id = 'summon-indiglo-creeper';

module.exports = SummonIndigloCreeper;
