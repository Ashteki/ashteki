const Card = require('../../Card.js');

class CerasaurusMount extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            effect: 'return its ally to hand',
            gameAction: ability.actions.sequentialForEach((context) => ({
                forEach: context.source.childCards,
                action: ability.actions.moveCard({ destination: 'hand' })
            }))
        });

        this.persistentEffect({
            effect: ability.effects.addKeyword({ overkill: 1 })
        });
    }
}

CerasaurusMount.id = 'cerasaurus-mount';

module.exports = CerasaurusMount;
