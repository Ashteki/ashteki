const Card = require('../../Card.js');

class Foresight extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Foresight',
            location: 'spellboard',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            target: {
                mode: 'options',
                activePromptTitle: "Foresight: Choose a player's deck",
                options: [
                    { name: 'Mine', value: false },
                    { name: "Opponent's", value: true }
                ],
                handler: (option) => (this.chosenValue = option.value)
            },
            gameAction: ability.actions.rearrangeCards((context) => ({
                amount: 2,
                target: this.chosenValue ? context.player.opponent : context.player,
                purgeType: 'bottom',
                reveal: false,
                purge: 1
            })),
            preferActionPromptMessage: true
        });

        this.persistentEffect({
            effect: ability.effects.additionalDraw(1)
        });
    }
}

Foresight.id = 'foresight';

module.exports = Foresight;
