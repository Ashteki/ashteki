const { Level, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class HopeEverthorn extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Duplicate',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Basic)])
            ],
            target: {
                activePromptTitle: 'Choose a conjuration you control to copy',
                controller: 'self',
                cardType: CardType.Conjuration,
                cardCondition: (card) => card.life == 1
            },
            gameAction: ability.actions.summon((context) => ({
                conjuration: context.target.id,
                showMessage: true
            })),
            //TODO: need a visual indicator for the duplicate so we know which one will be destroyed at end of turn
            then: (thenContext) => ({
                gameAction: ability.actions.lastingEffect({
                    when: {
                        onTurnEnded: () => true
                    },
                    gameAction: ability.actions.destroy({
                        target: thenContext.cards
                        //target: thenContext.target // This runs but doesn't destroy the unit in my test. It looks like this should kill the original
                    })
                })
            })
        });
    }
}

HopeEverthorn.id = 'hope-everthorn';

module.exports = HopeEverthorn;
