const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Earthquake extends Card {
    setupCardAbilities(ability) {
        this.preventAutoDice = true;

        this.play({
            title: 'Earthquake',
            target: {
                activePromptTitle: 'Choose a unit to deal 4 damage to',
                effect: 'deal 4 damage to {1}',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage({
                    amount: 4
                })
            },
            then: {
                message: '{1} deals 1 damage to all other units',
                target: {
                    autoTarget: (context) =>
                        context.game.unitsInPlay.filter((c) => c !== context.preThenEvent.card),

                    gameAction: ability.actions.orderedAoE({
                        gameAction: ability.actions.dealDamage({ showMessage: true }),
                        promptTitle: 'Earthquake'
                    })
                }
            }
        });
    }
}

Earthquake.id = 'earthquake';

module.exports = Earthquake;
