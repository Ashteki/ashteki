const Card = require('../../Card.js');
const { BattlefieldTypes, CardType } = require('../../../constants.js');

class RedRaindrop extends Card {
    setupCardAbilities(ability) {
        this.spellGuard({
            match: this
        });

        this.interrupt({
            when: {
                onRoundEnded: () => true
            },
            // target: {
            //     cardType: BattlefieldTypes,
            //     gameAction: ability.actions.dealDamage((context) => ({
            //         target: context.source.parent
            //     }))
            // }
        });
    }

    canAttach(card, context) {
        return card && card.getType() === CardType.Phoenixborn && this.canPlayAsUpgrade();
    }
}

RedRaindrop.id = 'red-raindrop';

module.exports = RedRaindrop;
