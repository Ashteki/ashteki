const { Level, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class DimonaOdinstar extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Promote',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(2, Level.Basic)])
            ],
            target: {
                controller: 'self',
                cardType: CardType.Ally,
                cardCondition: (card) => card.exhausted,
                gameAction: ability.actions.purge()
            },
            then: {
                gameAction: ability.actions.summon({
                    conjuration: 'empyrean-mount'
                }),
                then: {
                    gameAction: ability.actions.placeUnder((context) => ({
                        parent: context.preThenEvent.cards[0],
                        target: context.preThenEvent.context.preThenEvent.card,
                        facedown: true
                    }))
                }
            }
        });
    }
}

DimonaOdinstar.id = 'dimona-odinstar';

module.exports = DimonaOdinstar;
