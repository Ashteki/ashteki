const { UpgradeCardTypes, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class AdeptDuelist extends Card {
    setupCardAbilities(ability) {
        this.stalk();

        this.reaction({
            title: 'Disarm',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.attackers.includes(context.source);
                }
            },
            target: {
                optional: true,
                activePromptTitle: 'Choose an alteration to discard',
                cardType: UpgradeCardTypes,
                controller: 'opponent',
                cardCondition: (card) => BattlefieldTypes.includes(card.parent.type),
                gameAction: ability.actions.discard()
            }
        });
    }
}

AdeptDuelist.id = 'adept-duelist';

module.exports = AdeptDuelist;
