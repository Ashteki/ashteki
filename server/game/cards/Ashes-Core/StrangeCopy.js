const Card = require('../../Card.js');

class StrangeCopy extends Card {
    // You may play this spell after an opponent declares attackers.
    // Choose a unit you control to become a copy of a target unit for the remainder of the turn.
    // While a copy, that unit replaces its title, printed abilities and printed attack, life and
    // recover values with those of the target unit.
    // If a printed value is X, use the current value of X.
    // setupCardAbilities(ability) {
    //     this.reaction({
    //         when: {
    //             // opponent declares attackers
    //             onAttackersDeclared: (event, context) => event.player === context.player.opponent
    //         },
    //         effect: 'make a strange copy of a unit',
    //         targets: {
    //             myUnit: {
    //                 controller: 'self',
    //             },
    //             sourceUnit: {
    //             }
    //         }
    //     });
    // }
}

StrangeCopy.id = 'strange-copy';

module.exports = StrangeCopy;
