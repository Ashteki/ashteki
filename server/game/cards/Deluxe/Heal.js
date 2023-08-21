const { BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Heal extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: [...BattlefieldTypes, ...PhoenixbornTypes],
                gameAction: ability.actions.removeDamage((context) => {
                    let amount = 2;
                    if (BattlefieldTypes.includes(context.target.type)) {
                        amount = context.target.damage;
                    }
                    return {
                        amount: amount
                    };
                })
            }
        });
    }
}

Heal.id = 'heal';

module.exports = Heal;
