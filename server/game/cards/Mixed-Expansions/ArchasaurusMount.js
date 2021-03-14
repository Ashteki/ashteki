const Card = require('../../Card.js');

class ArchasaurusMount extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            effect: 'return its ally to hand',
            gameAction: ability.actions.sequentialForEach((context) => ({
                forEach: context.source.childCards,
                action: ability.actions.moveCard({ destination: 'hand' })
            }))
        });

        this.persistentEffect({
            effect: ability.effects.addKeyword({ gigantic: 2 })
        });
    }
}

ArchasaurusMount.id = 'archasaurus-mount';

module.exports = ArchasaurusMount;
