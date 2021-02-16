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
                    return {
                        amount: diceCost.filter((d) => d.level === Level.Power).length,
                        target: context.game.unitsInPlay
                    };
                })
            }
        });
    }
}

Meteor.id = 'meteor';

module.exports = Meteor;
