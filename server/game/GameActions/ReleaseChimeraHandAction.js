const PlayerAction = require('./PlayerAction');

class ReleaseChimeraHandAction extends PlayerAction {
    setup() {
        super.setup();
        this.name = 'releaseChimeraHand';
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
                player.releaseHand();
            }
        );
    }
}

module.exports = ReleaseChimeraHandAction;
