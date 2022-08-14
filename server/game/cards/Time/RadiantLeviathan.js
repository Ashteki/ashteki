const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RadiantLeviathan extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            // Coalesce
            condition: () => !this.exhausted,
            match: (card) => BattlefieldTypes.includes(card.type) && card !== this,
            effect: ability.effects.cannotBeAttackTarget()
        });

        this.destroyed({
            inexhaustible: true,
            condition: (context) => context.source.status,
            gameAction: ability.actions.summon((context) => ({
                conjuration: 'prism-tetra',
                count: context.source.status
            }))
        });
    }
}

RadiantLeviathan.id = 'radiant-leviathan';

module.exports = RadiantLeviathan;
