const PlayerAction = require('./PlayerAction');

class MakeFirstPlayerAction extends PlayerAction {
    setup() {
        super.setup();
        this.name = 'makeFirstPlayer';
        this.effectMsg = 'receive the first player token';
    }

    defaultTargets(context) {
        return context.player;
    }

    // canAffect(target, context) {
    //     return super.canAffect(target, context);
    // }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player: player, context: context }, (event) => {
            context.game.setRoundFirstPlayer(player, false);
            context.game.addMessage('{0} now has the first player token', player);
        });
    }
}

module.exports = MakeFirstPlayerAction;
