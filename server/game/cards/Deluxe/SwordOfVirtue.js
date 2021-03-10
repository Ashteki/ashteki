const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SwordOfVirtue extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                gameAction: ability.actions.chooseAction(() => ({
                    cardType: BattlefieldTypes,
                    choices: {
                        Destroy: ability.actions.destroy(),
                        'Remove tokens': [
                            ability.actions.removeDamage({
                                all: true,
                                showMessage: true
                            }),
                            ability.actions.removeExhaustion({
                                all: true,
                                showMessage: true
                            })
                        ]
                    }
                }))
            }
        });
    }
}

SwordOfVirtue.id = 'sword-of-virtue';

module.exports = SwordOfVirtue;
