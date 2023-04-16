const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class OldSalt extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            preferActionPromptMessage: true,
            gameAction: ability.actions.addDamageToken({ amount: 1 }),
            then: {
                effect: 'deal 1 damage to {1}',
                effectArgs: (context) => context.target,
                target: {
                    optional: true,
                    cardCondition: (card, context) => card !== context.source,
                    activePromptTitle: 'Throw 1\n Choose a unit to deal 1 damage to',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage({ showMessage: true })
                }
            }
        });
    }
}

OldSalt.id = 'old-salt';

module.exports = OldSalt;
