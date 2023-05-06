const { CardType, UpgradeCardTypes, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class PolarityMage extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Give and Take',
            gameAction: ability.actions.chooseAction({
                choices: {
                    'Return card': ability.actions.moveCard({
                        promptForSelect: {
                            optional: true,
                            controller: 'self',
                            location: 'discard',
                            cardType: [CardType.ConjuredAlteration, CardType.Upgrade]
                        },
                        destination: 'hand',
                        showMessage: true
                    }),
                    'Discard card': ability.actions.discard({
                        promptForSelect: {
                            optional: true,
                            cardType: UpgradeCardTypes,
                            controller: 'self',
                            cardCondition: (card) => BattlefieldTypes.includes(card.parent.type)
                        },
                        showMessage: true
                    })
                }
            })
        });
    }
}

PolarityMage.id = 'polarity-mage';

module.exports = PolarityMage;
