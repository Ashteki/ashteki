const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class DoubleEdge extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Double Edge',
            gameAction: ability.actions.draw({ amount: 2 }),
            then: {
                target: {
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.discard()
                },
                then: {
                    target: {
                        controller: 'opponent',
                        cardType: BattlefieldTypes,
                        gameAction: ability.actions.dealDamage({
                            amount: 1
                        })
                    },
                    then: {
                        alwaysTriggers: true,
                        target: {
                            autoTarget: (context) => context.player.opponent.phoenixborn,
                            gameAction: ability.actions.dealDamage({
                                amount: 1
                            })
                        }
                    }

                }
            }
        });
    }
}

DoubleEdge.id = 'double-edge';

module.exports = DoubleEdge;
