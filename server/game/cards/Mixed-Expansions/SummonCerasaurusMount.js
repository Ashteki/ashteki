const { Level, Magic, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonCerasaurusMount extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Cerasaurus Mount',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Natural),
                    new DiceCount(1, Level.Class, Magic.Divine)
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
                target: {
                    controller: 'self',
                    cardType: 'Conjuration',
                    cardCondition: (card) => card.id === 'cerasaurus-mount',
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

SummonCerasaurusMount.id = 'summon-cerasaurus-mount';

module.exports = SummonCerasaurusMount;
