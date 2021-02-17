const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Heal extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                gameAction: ability.actions.removeDamage((context) =>
                    context.target.type === CardType.Phoenixborn
                        ? {
                              amount: 2
                          }
                        : {
                              all: true
                          }
                )
            }
        });
    }
}

Heal.id = 'heal';

module.exports = Heal;
