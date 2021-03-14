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
                target: {
                    controller: 'self',
                    cardType: CardType.Conjuration,
                    cardCondition: (card) => card.id === 'archasaurus-mount',
                    location: 'archives',
                    gameAction: ability.actions.putIntoPlay()
                },
                then: {
                    gameAction: ability.actions.placeUnder((context) => ({
                        parent: context.preThenEvent.card,
                        target: context.preThenEvent.context.preThenEvent.card,
                        facedown: true
                    }))
                }
            }
        });
    }
}

SummonArchasaurusMount.id = 'summon-archasaurus-mount';

module.exports = SummonArchasaurusMount;
