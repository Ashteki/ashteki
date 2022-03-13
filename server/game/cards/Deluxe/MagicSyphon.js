const Card = require('../../Card.js');

class MagicSyphon extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Magic Syphon',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            gameAction: ability.actions.changeDice({
                owner: 'self'
            }),
            then: {
                target: {
                    mode: 'select',
                    activePromptTitle: "Magic Syphon: Choose which player's dice pool to affect",
                    choices: (context) => this.getPlayerOptions(context),
                    choiceHandler: (choice) => (this.chosenValue = choice.value)
                },
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.changeDice((context) => ({
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

MagicSyphon.id = 'magic-syphon';

module.exports = MagicSyphon;
