const PlayerAction = require('./PlayerAction');

class MakeChimeraHandAction extends PlayerAction {
    setup() {
        super.setup();
        this.name = 'makeChimeraHand';
    }

    canAffect(player, context) {
        return player.isDummy && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent(
            'unnamedEvent',
            {
                player: player,
                context: context
            },
            () => {
                player.getHand();
            }
        );
    }
}

module.exports = MakeChimeraHandAction;
