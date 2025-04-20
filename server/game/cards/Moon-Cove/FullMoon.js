const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FullMoon extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Full Moon',
            location: 'spellboard',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                mode: 'upTo',
                numCards: (context) => context.source.focus + 1,
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(1)
                })
            }
        });
    }
}

FullMoon.id = 'full-moon';

module.exports = FullMoon;
