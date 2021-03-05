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
            then: {
                gameAction: ability.actions.dealDamage((context) => {
                    let diceCost = context.preThenEvent.context.event.context.costs.returnDice;
                    const numLions = diceCost.filter((d) => d.level === Level.Power).length;
                    // BUG: this is reporting twice - switch to message and messageArgs?
                    // if (numLions > 0) {
                    //     context.game.addMessage(
                    //         '{0} uses {1} to deal an additional {2} damage',
                    //         context.player,
                    //         context.source,
                    //         numLions
                    //     );
                    // }
                    return {
                        amount: numLions,
                        target: context.game.unitsInPlay
                    };
                })
            }
        });
    }
}

Meteor.id = 'meteor';

module.exports = Meteor;
