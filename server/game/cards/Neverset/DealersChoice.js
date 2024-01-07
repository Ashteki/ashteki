const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class DealersChoice extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: "Dealer's Choice",
            targets: {
                unit: {
                    targetsPlayer: true,
                    ignoreTargetCheck: true,
                    activePromptTitle: "Choose an opponent's unit",
                    controller: 'opponent',
                    cardType: BattlefieldTypes
                },
                other: {
                    ignoreTargetCheck: true,
                    activePromptTitle: 'Choose another card controlled by your opponent',
                    controller: 'opponent',
                    location: ['play area', 'spellboard']
                },
                exhaust: {
                    player: 'opponent',
                    ignoreTargetCheck: true,
                    activePromptTitle: 'Choose which card to exhaust',
                    cardCondition: (card, context) =>
                        [context.targets.unit, context.targets.other].includes(card),
                    gameAction: ability.actions.exhaust()
                }
            }
        });
    }
}

DealersChoice.id = 'dealers-choice';

module.exports = DealersChoice;
