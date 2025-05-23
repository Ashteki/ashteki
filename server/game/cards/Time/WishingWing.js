const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class WishingWing extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            unblankable: true,
            effect: [ability.effects.setPrintedAttack(() => this.status)]
        });

        this.entersPlay({
            condition: (context) =>
                context.player.dice.some(
                    (d) => d.magic === Magic.Time && d.level === Level.Power && !d.exhausted
                ),
            gameAction: ability.actions.addStatusToken((context) => ({
                target: context.source
            }))
        });
        this.destroyed({
            inexhaustible: true,
            target: {
                mode: 'select',
                activePromptTitle: 'Bequest: How many cards do you want to draw?',
                choices: (context) => this.getValueOptions(context.source.status),
                choiceHandler: (option) => (this.chosenValue = option.value),
            },
            gameAction: ability.actions.draw((context) => ({
                amount: this.chosenValue
            }))
        });
    }

    getValueOptions(maxValue) {
        let values = [];
        for (let i = 0; i <= maxValue; i++) {
            values.push({ text: '' + i, value: i });
        }
        return values;
    }
}

WishingWing.id = 'wishing-wing';

module.exports = WishingWing;
