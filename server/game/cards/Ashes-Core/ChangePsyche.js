const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ChangePsyche extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Change Psyche',
            target: {
                mode: 'select',
                choices: {
                    'Add token': ability.actions.exhaust({
                        promptForSelect: {
                            cardType: BattlefieldTypes
                        }
                    }),
                    'Remove token': ability.actions.removeExhaustion({
                        promptForSelect: {
                            cardType: BattlefieldTypes
                        }
                    })
                }
            }
        });
    }
}

ChangePsyche.id = 'change-psyche';

module.exports = ChangePsyche;
