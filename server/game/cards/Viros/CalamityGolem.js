const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class CalamityGolem extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Rancor',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some((b) => b.attacker === context.source);
                }
            },
            target: {
                optional: true,
                title: 'Rancor',
                activePromptTitle: 'Choose a unit to deal damage to',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.source.damage
                }))
            }
        });
    }
}

CalamityGolem.id = 'calamity-golem';

module.exports = CalamityGolem;
