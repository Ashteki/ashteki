const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Heal extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
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
