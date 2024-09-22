const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ShadeProwler extends Card {
    setupCardAbilities(ability) {
        this.fade();

        //TODO: Predator 3
        this.forcedReaction({
            title: 'Predator 3',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.attackers.includes(context.source);
                }
            },
            target: {
                optional: true,
                title: 'Predator 3',
                activePromptTitle: 'Choose a unit to deal damage to',
                cardCondition: (card, context) => card.attack < context.source.attack,
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: this.getAbilityNumeric(3)
                }))
            }
        });

    }
}

ShadeProwler.id = 'shade-prowler';

module.exports = ShadeProwler;
