const { UpgradeCardTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Dispel extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.chooseAction(() => ({
                choices: {
                    'Remove status tokens': ability.actions.removeStatus({
                        amount: 2,
                        promptForSelect: {
                            cardCondition: (card) => card.status > 0
                        },
                        showMessage: true
                    }),
                    'Return alteration': ability.actions.returnToDeck({
                        promptForSelect: {
                            cardType: UpgradeCardTypes
                        },
                        reveal: true,
                        showMessage: true
                    })
                }
            }))
        });
    }
}

Dispel.id = 'dispel';

module.exports = Dispel;
