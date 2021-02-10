const Card = require('../../Card.js');

class Meteor extends Card {
    setupCardAbilities(ability) {
        this.preventAutoDice = true;

        this.play({
            title: 'Meteor',
            effect: 'deal 1 damage to all units - ADDITIONAL LION DAMAGE IS MANUAL',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.game.unitsInPlay
            }))
        });
    }
}

Meteor.id = 'meteor';

module.exports = Meteor;
