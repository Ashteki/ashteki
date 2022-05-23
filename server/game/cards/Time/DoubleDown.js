const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class DoubleDown extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    // a 1-life conjuration that I control
                    event.card.type === CardType.Conjuration &&
                    event.card.life === 1 &&
                    // check the clone because ondestroyed resets controller to owner (blood puppet)
                    event.clone.controller === context.source.owner &&
                    // destroyed as a result of an event that my opponent controls
                    (context.event.context.source.controller === context.source.controller.opponent ||
                        // ignoring damage event also appears
                        (context.event.tokenEvent &&
                            context.event.tokenEvent.context.player ===
                            context.source.controller.opponent))
            },
            gameAction: ability.actions.summon((context) => ({
                conjuration: context.event.card.id,
                count: this.getConjurationCount(context),
                showMessage: true
            }))
        });
    }
    getConjurationCount(context) {
        let cards = context.player.archives.filter((c) => c.id === context.event.card.id);
        // takes into account that the destroyed conjuration is already in the conjuration pile
        return Math.min(cards.length - 1, 2);
    }
}

DoubleDown.id = 'double-down';

module.exports = DoubleDown;
