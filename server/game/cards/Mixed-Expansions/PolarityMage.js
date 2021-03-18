const { CardType, UpgradeCardTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class PolarityMage extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Give and Take',
            gameAction: ability.actions.chooseAction({
                choices: {
                    'Return to Hand': ability.actions.moveCard({
                        promptForSelect: {
                            controller: 'self',
                            location: 'discard',
                            cardType: [CardType.ConjuredAlteration, CardType.Upgrade]
                        },
                        destination: 'hand'
                    }),
                    'Discard from Play': ability.actions.discard({
                        promptForSelect: {
                            CardType: UpgradeCardTypes,
                            controller: 'self'
                        }
                    })
                }
            })
        });
    }
}

PolarityMage.id = 'polarity-mage';

module.exports = PolarityMage;
