const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonMetamorpher extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Metamorpher',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Basic)])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'metamorpher'
            }),
            then: {
                // focus 2 ability
                alwaysTriggers: true,
                condition: () => this.focus >= 1,
                gameAction: ability.actions.draw(),
                then: {
                    alwaysTriggers: true,
                    condition: () => this.focus >= 2,
                    cost: ability.costs.chosenDiscard(1, true),
                    target: {
                        activePromptTitle: 'Choose a card to place on the bottom of your deck',
                        controller: 'self',
                        location: 'discard',
                        showCancel: true,
                        cardCondition: (card) => card.type.includes('Spell'),
                        gameAction: ability.actions.returnToDeck((context) => ({
                            target: context.target,
                            bottom: true,
                            reveal: true,
                            shuffle: false
                        }))
                    }
                }
            }
        });
    }
}

SummonMetamorpher.id = 'summon-metamorpher';

module.exports = SummonMetamorpher;
