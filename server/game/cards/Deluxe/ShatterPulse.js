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
                target: {
                    mode: 'select',
                    activePromptTitle: "Shatter Pulse: Choose which player's dice pool to affect",
                    choices: (context) => this.getPlayerOptions(context),
                    choiceHandler: (choice) => (this.chosenValue = choice.value)
                },
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.changeDice((context) => ({
                        numDice: 2,
                        owner:
                            this.chosenValue === context.player.opponent.name ? 'opponent' : 'self'
                    }))
                }
            }
        });
    }

    getPlayerOptions(context) {
        let choices = [context.player.name];

        if (context.player.checkRestrictions('changeOpponentsDice')) {
            choices.push(context.player.opponent.name);
        }
        return choices.map((t) => ({ text: t, value: t }));
    }
}

ShatterPulse.id = 'shatter-pulse';

module.exports = ShatterPulse;
