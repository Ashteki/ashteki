const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class Meteor extends Card {
    setupCardAbilities(ability) {
        this.preventAutoDice = true;

        this.play({
            title: 'Meteor',
            effect: 'deal 1 damage to all units',
            message: '{0} spends {1} on meteor',
            messageArgs: (context) => [context.player, context.event.context.costs.returnDice],
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => context.game.unitsInPlay,
                gameAction: ability.actions.orderedAoE({
                    gameAction: ability.actions.dealDamage({ showMessage: true }),
                    promptTitle: 'Meteor'
                })
            },
            then: (context) => {
                let diceCost = context.event.context.costs.returnDice;
                const numLions = diceCost.filter((d) => d.level === Level.Power).length;
                if (numLions > 0) {
                    return {
                        message: '{0} paid {3} so deals {4} extra damage to all units',
                        messageArgs: [diceCost, numLions],

                        target: {
                            ignoreTargetCheck: true,
                            autoTarget: (context) => context.game.unitsInPlay,
                            gameAction: ability.actions.orderedAoE({
                                gameAction: ability.actions.dealDamage({
                                    amount: numLions,
                                    showMessage: true
                                }),
                                promptTitle: 'Meteor II'
                            })
                        },
                    };
                }
            }
        });
    }
}

Meteor.id = 'meteor';

module.exports = Meteor;
