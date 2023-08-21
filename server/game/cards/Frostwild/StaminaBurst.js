const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class StaminaBurst extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.removeDamage((context) => ({
                amount: 1,
                target: context.source.owner.phoenixborn,
                showMessage: true
            })),
            then: {
                target: {
                    activePromptTitle: 'Choose a unit to receive a spark alteration',
                    cardType: BattlefieldTypes,
                    controller: 'self',
                    gameAction: [
                        ability.actions.addStatusToken(),
                        ability.actions.attachConjuredAlteration({
                            conjuredAlteration: 'spark'
                        })
                    ]
                }
            }
        });
    }
}

StaminaBurst.id = 'stamina-burst';

module.exports = StaminaBurst;
