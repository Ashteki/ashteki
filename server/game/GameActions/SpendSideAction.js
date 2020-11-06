const PlayerAction = require('./PlayerAction');

class SpendSideAction extends PlayerAction {
    setDefaultProperties() {
        // this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'spendSideAction';
        this.effectMsg = "use {0}'s side action";
    }

    canAffect(player, context) {
        return player.actions.side && super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent(
            'onSpendSideAction',
            { player: player, context: context },
            (event) => event.player.spendSideAction()
        );
    }
}

module.exports = SpendSideAction;
