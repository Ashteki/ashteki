const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FromDarkness extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'From Darkness',
            when: {
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent &&
                    event.source.owner.hasExhaustedUnit()
            },
            targets: {
                myChar: {
                    activePromptTitle: 'Choose an exhausted unit for attack value',
                    cardType: BattlefieldTypes,
                    controller: 'self',
                    cardCondition: (card) => card.exhausted
                },
                oppChar: {
                    dependsOn: 'myChar',
                    activePromptTitle: 'Choose an attacker to deal damage to',
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    cardCondition: (card) => card.isAttacker,
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.targets.myChar.attack
                    }))
                }
            }
        });
    }
}

FromDarkness.id = 'from-darkness';

module.exports = FromDarkness;
