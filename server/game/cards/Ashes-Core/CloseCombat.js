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
                    cardType: ['Ally', 'Conjuration'],
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.targets.myChar.attack
                    }))
                }
            },
            then: {
                target: {
                    mode: 'select',
                    choices: {
                        Wound: ability.actions.dealDamage((context) => ({
                            amount: 1,
                            target: context.targets.myChar
                        })),
                        Exhaust: ability.actions.exhaust((context) => ({
                            amount: 1,
                            target: context.targets.myChar
                        }))
                    }
                }
            }
        });
    }
}

CloseCombat.id = 'close-combat';

module.exports = CloseCombat;
