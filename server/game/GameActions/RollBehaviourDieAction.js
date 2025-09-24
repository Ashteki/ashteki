const PlayerAction = require('./PlayerAction');

class RollBehaviourDieAction extends PlayerAction {
    setup() {
        super.setup();
        this.name = 'rollBehaviourDie';
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
                context.dieResult = player.getBehaviourRoll();
                context.game.addMessage('{0} rolls their behaviour die: {1}', player, context.dieResult);
            }
        );
    }
}

module.exports = RollBehaviourDieAction;
