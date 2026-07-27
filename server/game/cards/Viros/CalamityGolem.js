const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class CalamityGolem extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            title: 'Rancor',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.attackers.includes(context.source);
                }
            },
            target: {
                optional: true,
                title: 'Rancor',
                activePromptTitle: (context) =>
                    'Choose a card to deal' + context.source.damage + 'damage to',
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
