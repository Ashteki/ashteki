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
            then: { //Probably need a visual indicator for the duplicate
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    target: context.preThenEvent.card, // Not sure how to target the previous card
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.gainAbility('persistentEffect', {
                        effect: ability.effects.destroyAtEndOfTurn()
                    })
                }))
            }
        });
    }
}

HopeEverthorn.id = 'hope-everthorn';

module.exports = HopeEverthorn;
