const Card = require('../../Card.js');

class CloseCombat extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                myChar: {
                    activePromptTitle: 'Select a card for attack value',
                    cardType: ['Ally', 'Conjuration'],
                    controller: 'self',
                    cardCondition: (card) => !card.exhausted
                },
                oppChar: {
                    dependsOn: 'myChar',
                    activePromptTitle: 'Choose a unit to damage',
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
                    Wound: ability.actions.addDamageToken({
                        target: context.targets.myChar
                    }),
                    Exhaust: ability.actions.addExhaustionToken({ target: context.targets.myChar })
                }
            }))
        });
    }
}

CloseCombat.id = 'close-combat';

module.exports = CloseCombat;
