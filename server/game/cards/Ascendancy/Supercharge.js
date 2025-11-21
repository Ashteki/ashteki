const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants.js');

class Supercharge extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Supercharge',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            target: {
                showCancel: true,
                cardType: BattlefieldTypes,
                gameAction: ability.actions.conditional({
                    condition: (context) => context.source.isCharged,
                    trueGameAction: ability.actions.cardLastingEffect((context) => ({
                        duration: 'untilEndOfTurn',
                        effect: ability.effects.modifyAttack(2)
                    }))
                })
            }
        });
    }
}

Supercharge.id = 'supercharge';

module.exports = Supercharge;
