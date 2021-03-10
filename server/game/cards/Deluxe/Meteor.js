const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class Meteor extends Card {
    setupCardAbilities(ability) {
        this.preventAutoDice = true;

        this.play({
            title: 'Meteor',
            effect: 'deal 1 damage to all units',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.game.unitsInPlay
            })),
            then: (context) => {
                let diceCost = context.event.context.costs.returnDice;
                const numLions = diceCost.filter((d) => d.level === Level.Power).length;
                if (numLions > 0)
                    return {
                        message: '{0} paid {3} so deals {4} extra damage to all units',
                        messageArgs: [diceCost, numLions],
                        gameAction: ability.actions.dealDamage({
                            amount: numLions,
                            target: context.game.unitsInPlay
                        })
                    };
            }
        });
    }
}

Meteor.id = 'meteor';

module.exports = Meteor;
