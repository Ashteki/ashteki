const PlayerAction = require('./PlayerAction');

class RefreshSideAction extends PlayerAction {
    setDefaultProperties() {
        // this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'refreshSideAction';
        this.effectMsg = "refreshes {0}'s side action";
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return !player.actions.side && super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent(
            'onRefreshSideAction',
            { player: player, context: context },
            (event) => (event.player.actions.side = true)
        );
    }
}

module.exports = RefreshSideAction;
