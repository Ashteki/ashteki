const { Magic, Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonFallen extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            autoResolve: true,
            location: 'spellboard',
            when: {
                onCardDestroyed: (event, context) =>
                    event.card.type === 'Ally' && event.card.controller == context.player
            },
            condition: (context) => context.source.status < 3,
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 1,
                target: context.source
            }))
        });

        this.action({
            title: 'Summon Fallen',
            location: 'spellboard',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Ceremonial),
                    new DiceCount(1, Level.Power, Magic.Ceremonial)
                ])
            ],
            target: {
                mode: 'select',
                activePromptTitle: 'how many fallen to summon?',
                choices: (context) => this.getValueOptions(context.source.status),
                choiceHandler: (option) => (this.chosenValue = option.value),
            },
            gameAction: [
                ability.actions.removeStatus((context) => ({
                    target: context.source,
                    amount: this.chosenValue,
                    showMessage: true
                })),
                ability.actions.summon((context) => ({
                    conjuration: 'fallen',
                    count: this.chosenValue
                }))
            ]
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

SummonFallen.id = 'summon-fallen';

module.exports = SummonFallen;
