const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Earthquake extends Card {
    setupCardAbilities(ability) {
        this.preventAutoDice = true;

        this.play({
            title: 'Earthquake',
            target: {
                effect: 'deal 4 damage to {1}',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage({
                    amount: 4
                })
            },
            then: {
                message: '{1} deals 1 extra damage to all other units',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: 1,
                    target: context.game.unitsInPlay.filter((c) => c !== context.preThenEvent.card)
                }))
            }
        });
    }
}

Earthquake.id = 'earthquake';

module.exports = Earthquake;
