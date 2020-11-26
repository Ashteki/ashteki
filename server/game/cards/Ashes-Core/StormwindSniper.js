const Card = require('../../Card.js');

class StormwindSniper extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.concealed()
        });

        this.play({
            title: 'Ambush 1',
            effect: 'deal 1 damage to a target phoenixborn',
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.player.opponent.phoenixborn
            }))
        });
    }
}

StormwindSniper.id = 'stormwind-sniper';

module.exports = StormwindSniper;
