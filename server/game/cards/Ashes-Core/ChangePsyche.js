const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ChangePsyche extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Change Psyche',
            // this is set because messages are displayed before gameAction promptForSelect triggers
            targets: {
                aUnit: {
                    cardType: BattlefieldTypes
                },
                chooser: {
                    dependsOn: 'aUnit',
                    mode: 'select',
                    choices: {
                        'Add token': ability.actions.exhaust((context) => ({
                            target: context.targets.aUnit
                        })),
                        'Remove token': ability.actions.removeExhaustion((context) => ({
                            target: context.targets.aUnit
                        }))
                    }
                }
            }
        });
    }
}

ChangePsyche.id = 'change-psyche';

module.exports = ChangePsyche;
