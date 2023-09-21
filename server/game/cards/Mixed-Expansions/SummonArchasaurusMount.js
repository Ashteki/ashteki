const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class SummonArchasaurusMount extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Summon Archasaurus Mount',
            target: {
                controller: 'self',
                cardType: CardType.Ally,
                cardCondition: (card) => !card.exhausted,
                gameAction: ability.actions.purge()
            },
            then: {
                gameAction: ability.actions.summon({
                    conjuration: 'archasaurus-mount'
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

SummonArchasaurusMount.id = 'summon-archasaurus-mount';

module.exports = SummonArchasaurusMount;
