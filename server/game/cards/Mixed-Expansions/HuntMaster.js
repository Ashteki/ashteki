const Card = require('../../Card.js');

class HuntMaster extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.addStatusToken({ amount: 2 }),
            then: {
                target: {
                    activePromptTitle: 'Call the Hunt',
                    controller: 'self',
                    cardType: 'Conjuration',
                    cardCondition: (card) => card.id === 'panther-spirit',
                    location: 'archives',
                    gameAction: ability.actions.putIntoPlay()
                }
            }
        });

        this.action({
            title: 'Guide 1',
            cost: [ability.costs.sideAction(), ability.costs.loseStatus()],
            target: {
                cardType: ['Ally', 'Conjuration'],
                controller: 'self',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(1)
                })
            }
        });
    }
}

HuntMaster.id = 'hunt-master';

module.exports = HuntMaster;
