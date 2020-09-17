const PlayerAction = require('./PlayerAction');

class SpendMainAction extends PlayerAction {
    setDefaultProperties() {
        // this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'spendMainAction';
        this.effectMsg = "use {0}'s main action";
    }

    canAffect(player, context) {
        return player.actions.main && super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent(
            'onSpendMainAction',
            { player: player, context: context },
            (event) => event.player.spendMainAction()
        );
    }
}

module.exports = SpendMainAction;
