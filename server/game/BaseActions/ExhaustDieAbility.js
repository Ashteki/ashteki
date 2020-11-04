const { Costs } = require('../costs');
const DieAbility = require('./DieAbility');

class ExhaustDieAbility extends DieAbility {
    constructor(die) {
        let costs = [Costs.sideAction()];
        super(die, costs);
        this.title = 'Exhaust this Die';
    }

    executeHandler(context) {
        context.game.actions.exhaustDie().resolve(this.die, context);
    }

    displayMessage(context) {
        context.game.addMessage('{0} exhausts a die', context.player, context.source);
    }
}

module.exports = ExhaustDieAbility;
