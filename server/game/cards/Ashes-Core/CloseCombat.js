const Card = require('../../Card.js');

class CloseCombat extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                myChar: {
                    cardType: ['Ally', 'Conjuration'],
                    controller: 'self',
                    cardCondition: (card) => !card.exhausted
                },
                oppChar: {
                    dependsOn: 'myChar',
                    cardType: ['Ally', 'Conjuration'],
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.targets.myChar.attack
                    }))
                }
            },
            gameAction: ability.actions.chooseAction((context) => ({
                // activePromptTitle: 'Choose one:',
                target: context.targets.myChar,
                choices: {
                    Wound: ability.actions.dealDamage({
                        target: context.targets.myChar
                    }),
                    Exhaust: ability.actions.exhaust({ target: context.targets.myChar })
                }
            }))
        });
    }
}

CloseCombat.id = 'close-combat';

module.exports = CloseCombat;
