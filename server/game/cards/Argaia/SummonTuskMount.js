const { Level, Magic, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonTuskMount extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Tusk Mount',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(2, Level.Class, Magic.Time),
                    new DiceCount(2, Level.Basic)
                ])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: CardType.Ally,
                cardCondition: (card) => !card.exhausted,
                gameAction: ability.actions.purge()
            },
            then: {
                gameAction: ability.actions.summon({
                    conjuration: 'tusk-mount'
                }),
                then: {
                    gameAction: ability.actions.placeUnder((context) => ({
                        parent: context.preThenEvent.cards[0],
                        target: context.preThenEvent.context.preThenEvent.card
                    }))
                }
            }
        });
    }
}

SummonTuskMount.id = 'summon-tusk-mount';

module.exports = SummonTuskMount;
