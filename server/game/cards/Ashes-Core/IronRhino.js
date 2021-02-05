const Card = require('../../Card.js');

class IronRhino extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword({ gigantic: 1 })
        });

        // overkill 2
        this.destroysFighting({
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.player.opponent.phoenixborn
            }))
        });
    }
}

IronRhino.id = 'iron-rhino';

module.exports = IronRhino;
