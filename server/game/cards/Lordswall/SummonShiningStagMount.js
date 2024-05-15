const { Level, Magic, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonShiningStagMount extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Shining Stag Mount',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Divine),
                    new DiceCount(1, Level.Basic)
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
                    conjuration: 'shining-stag-mount'
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

SummonShiningStagMount.id = 'summon-shining-stag-mount';

module.exports = SummonShiningStagMount;
