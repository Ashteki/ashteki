const { Level, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class TristanDarkwater extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Magnify',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Basic)])
            ],
            target: {
                mode: 'upTo',
                numCards: 3,
                controller: 'self',
                cardType: BattlefieldTypes,
                cardCondition: (card) => true, // replace with life check
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.magnify((card) => (card.isAttacker ? 2 : 0))
                }))
            }
        });
    }
}

TristanDarkwater.id = 'tristan-darkwater';

module.exports = TristanDarkwater;
