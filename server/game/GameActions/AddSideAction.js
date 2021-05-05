const PlayerAction = require('./PlayerAction');

class AddSideAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'addSideAction';
        this.effectMsg = 'gives {0} a side action';
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent(
            'unnamedevent',
            { player: player, context: context, amount: this.amount },
            (event) => (event.player.actions.side += event.amount)
        );
    }
}

module.exports = AddSideAction;
