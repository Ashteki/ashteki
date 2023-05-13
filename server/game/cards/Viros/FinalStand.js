const { BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FinalStand extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.conditional({
                    condition: (context) => context.player.hand.length === 0,
                    trueGameAction: ability.actions.dealDamage({
                        promptForSelect: {
                            cardType: BattlefieldTypes,
                            activePromptTitle: 'Choose a unit to receive 4 damage',
                        },
                        amount: 4,
                        showMessage: true
                    })
                }),
                ability.actions.conditional({
                    condition: (context) => context.player.phoenixborn.damage > 11,
                    trueGameAction: ability.actions.dealDamage({
                        promptForSelect: {
                            cardType: PhoenixbornTypes,
                            activePromptTitle: 'Choose a phoenixborn to receive 2 damage',
                        },
                        amount: 2,
                        showMessage: true
                    }),
                })
            ])
        });
    }
}

FinalStand.id = 'final-stand';

module.exports = FinalStand;
