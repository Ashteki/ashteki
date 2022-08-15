const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class CrystalArcher extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Preemptive Shot 1',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some((b) => b.attacker === context.source);
                },
                onDefendersDeclared: (event, context) => {
                    return event.attack.battles.some((b) => b.guard === context.source);
                }
            },
            target: {
                optional: true,
                activePromptTitle: 'Choose a unit to deal damage to',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage(() => ({
                    amount: this.getAbilityNumeric(1)
                }))
            }
        });
    }
}

CrystalArcher.id = 'crystal-archer';

module.exports = CrystalArcher;
