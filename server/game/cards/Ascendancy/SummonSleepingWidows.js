const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Propagate extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    CardType.Conjuration === event.card.type &&
                    // check the clone because ondestroyed resets controller to owner (blood puppet)
                    event.clone.controller === context.source.owner
            },
            gameAction: ability.actions.summon({
                conjuration: 'snapseed',
                count: 2
            })
        });
    }
}

Propagate.id = 'propagate';

module.exports = Propagate;
