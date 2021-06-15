const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ShatterPulse extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.clone.controller == context.player && // it's mine
                    BattlefieldTypes.includes(event.card.type) // it's a unit
            },
            target: {
                activePromptTitle: 'Choose a unit to destroy',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.destroy()
            },
            then: {
                //TODO: this needs restricting to a single player
                gameAction: ability.actions.changeDice((context) => ({
                    numDice: 2,
                    owner: context.player.checkRestrictions('changeOpponentsDice') ? 'any' : 'self'
                }))
            }
        });
    }
}

ShatterPulse.id = 'shatter-pulse';

module.exports = ShatterPulse;
