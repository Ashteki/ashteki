const { Costs } = require('../costs');
const DieAbility = require('./DieAbility');

class PowerDieAbility extends DieAbility {
    constructor(die) {
        let costs = [Costs.sideAction(), Costs.exhaustDie()];
        super(die, costs);
        this.title = 'Use this die power';
    }

    // executeHandler(context) {
    //     switch (this.die.magic) {
    //         case 'natural':
    //             context.game.actions.dealDamage((context) => ({
    //                 amount: 1,
    //                 target: context.game.creaturesInPlay
    //             })).resolve(, context);
    //     }
    //     // context.game.actions.exhaustDie().resolve(this.die, context);
    // }

    displayMessage(context) {
        context.game.addMessage('{0} uses {1} die power', context.player, context.source.magic);
    }
}

module.exports = PowerDieAbility;
