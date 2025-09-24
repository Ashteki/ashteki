const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class DoubleEdge extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Double Edge',
            gameAction: ability.actions.draw({ amount: 2 }),
            then: {
                target: {
                    activePromptTitle: 'Choose a card to discard',
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.discard()
                },
                then: {
                    target: {
                        activePromptTitle: 'Choose a unit to deal 1 damage to',
                        controller: 'opponent',
                        cardType: BattlefieldTypes,
                        gameAction: ability.actions.dealDamage({
                            amount: 1,
                            showMessage: true
                        })
                    },
                    then: {
                        alwaysTriggers: true,
                        target: {
                            autoTarget: (context) => context.player.opponent.phoenixborn,
                            gameAction: ability.actions.dealDamage({
                                amount: 1,
                                showMessage: true
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
