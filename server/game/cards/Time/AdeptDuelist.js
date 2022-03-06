const { BattlefieldTypes, UpgradeCardTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class AdeptDuelist extends Card {
    setupCardAbilities(ability) {
        this.stalk();

        this.reaction({
            title: 'Disarm',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some((b) => b.attacker === context.source);
                }
            },
            target: {
                optional: true,
                activePromptTitle: 'Choose an alteration to discard',
                cardType: UpgradeCardTypes,
                controller: 'opponent',
                // condition: (card) => BattlefieldTypes.includes(card.parent.type),
                gameAction: ability.actions.discard()
            }
        });
    }
}

AdeptDuelist.id = 'adept-duelist';

module.exports = AdeptDuelist;
