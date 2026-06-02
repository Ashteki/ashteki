const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FloralTyrant extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Ravaging Vines',
            when: {
                onAttackersDeclared: (event, context) =>
                    // I'm the attacker
                    event.attackers.includes(context.source) && context.source.isCharged
            },
            target: {
                activePromptTitle: 'Choose an card to deal damage to',
                controller: 'opponent',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.source.attack
                }))
            }
        });
    }
}

FloralTyrant.id = 'floral-tyrant';

module.exports = FloralTyrant;
