const Card = require('../../Card.js');

class NightsongCricket extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            title: 'Polyphony',
            target: {
                mode: 'select',
                activePromptTitle: "Nightsong Cricket: Choose which player's dice pool to affect",
                choices: (context) => this.getPlayerOptions(context),
                choiceHandler: (choice) => (this.chosenValue = choice.value)
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.changeDice((context) => ({
                    dieCondition: (die) => !die.exhausted,
                    owner: this.chosenValue === context.player.opponent.name ? 'opponent' : 'self'
                }))
            }
        });

        this.destroyed({
            title: 'Renewed Harmony',
            targets: {
                theirChoice: {
                    activePromptTitle: "Choose a card to return to your opponent's hand",
                    player: 'opponent',
                    controller: 'self',
                    location: 'discard'
                },
                myChoice: {
                    activePromptTitle: "Choose a card to return to your opponent's hand",
                    controller: 'opponent',
                    location: 'discard',
                    gameAction: [
                        ability.actions.moveCard((context) => ({
                            target: context.targets.theirChoice,
                            destination: 'hand'
                        })),
                        ability.actions.moveCard((context) => ({
                            target: context.targets.myChoice,
                            destination: 'hand'
                        }))
                    ]
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

NightsongCricket.id = 'nightsong-cricket';

module.exports = NightsongCricket;
