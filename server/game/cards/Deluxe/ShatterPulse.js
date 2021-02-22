const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ShatterPulse extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.card.controller == context.player && // it's mine
                    BattlefieldTypes.includes(event.card.type) // it's a unit
            },
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.changeDice({
                    numDice: 2,
                    owner: 'opponent'
                })
            }
        });
    }
}

ShatterPulse.id = 'shatter-pulse';

module.exports = ShatterPulse;
