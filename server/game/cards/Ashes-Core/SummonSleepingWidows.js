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
            gameAction: ability.actions.summon({
                conjuration: 'sleeping-widow',
                count: 2
            })
        });
    }
}

SummonSleepingWidows.id = 'summon-sleeping-widows';

module.exports = SummonSleepingWidows;
