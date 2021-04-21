const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SummonSleepingWidows extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    BattlefieldTypes.includes(event.card.type) &&
                    // check the clone because ondestroyed resets controller to owner (blood puppet)
                    event.clone.controller === context.source.owner
            },
            target: {
                mode: 'upTo',
                numCards: 2,
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'sleeping-widow',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonSleepingWidows.id = 'summon-sleeping-widows';

module.exports = SummonSleepingWidows;
