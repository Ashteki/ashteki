const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class DoubleDown extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.card.type === CardType.Conjuration &&
                    event.card.life === 1 &&
                    // check the clone because ondestroyed resets controller to owner (blood puppet)
                    event.clone.controller === context.source.owner &&
                    (context.event.context.source.controller ===
                        context.source.controller.opponent ||
                        // damageEvent from opponent
                        (context.event.damageEvent &&
                            context.event.damageEvent.damageSource.controller ===
                                context.source.controller.opponent) ||
                        (context.event.tokenEvent &&
                            context.event.tokenEvent.context.player ===
                                context.source.controller.opponent))
            },
            gameAction: ability.actions.summon((context) => ({
                conjuration: context.event.card.id,
                count: 2,
                showMessage: true
            }))
        });
    }
}

DoubleDown.id = 'double-down';

module.exports = DoubleDown;