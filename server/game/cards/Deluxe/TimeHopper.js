const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class TimeHopper extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                optional: true,
                activePromptTitle: 'Choose a card to add a status token to',
                cardType: BattlefieldTypes,
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.addStatusToken()
            }
        });

        this.fearful();
    }
}

TimeHopper.id = 'time-hopper';

module.exports = TimeHopper;
