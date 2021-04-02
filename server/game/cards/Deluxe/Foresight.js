const Card = require('../../Card.js');

class Foresight extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Foresight',
            location: 'spellboard',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            gameAction: ability.actions.rearrangeCards((context) => ({
                amount: 2,
                target: context.player.opponent,
                purgeType: 'bottom',
                reveal: false
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
