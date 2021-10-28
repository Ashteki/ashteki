const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class CloseCombat extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                myChar: {
                    activePromptTitle: 'Select a card for attack value',
                    cardType: BattlefieldTypes,
                    controller: 'self',
                    cardCondition: (card) => !card.exhausted
                },
                oppChar: {
                    dependsOn: 'myChar',
                    activePromptTitle: 'Choose a unit to damage',
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.targets.myChar.attack
                    }))
                }
            },
            gameAction: ability.actions.chooseAction((context) => ({
                activePromptTitle: 'Choose effect for your unit:',
                target: context.targets.myChar,
                choices: {
                    Wound: ability.actions.addDamageToken({
                        target: context.targets.myChar
                    }),
                    Exhaust: ability.actions.addExhaustionToken({ target: context.targets.myChar })
                },
                messages: {
                    Wound: '{0} chooses to add 1 wound to {1}',
                    Exhaust: '{0} chooses to add 1 exhaustion token to {1}'
                }
            }))
        });
    }
}

CloseCombat.id = 'close-combat';

module.exports = CloseCombat;
