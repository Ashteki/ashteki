const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class OldSalt extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.addDamageToken({ amount: 1 }),
            then: {
                effect: 'deal 1 damage to {1}',
                effectArgs: (context) => context.target,
                target: {
                    optional: true,
                    cardCondition: (card, context) => card !== context.source,
                    activePromptTitle: 'Throw 1',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage()
                }
            }
        });
    }
}

OldSalt.id = 'old-salt';

module.exports = OldSalt;
