const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class Anchornaut extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Throw 1',
            effect: 'deal 1 damage to {1}',
            effectArgs: (context) => context.target,
            target: {
                showCancel: true,
                cardCondition: (card, context) => card !== context.source,
                activePromptTitle: 'Throw 1\n Choose a unit to deal 1 damage to',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage()
            }
        });
    }
}

Anchornaut.id = 'anchornaut';

module.exports = Anchornaut;
