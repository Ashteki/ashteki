const PlayerAction = require('./PlayerAction');

class ResolveBehaviourSideAction extends PlayerAction {
    setup() {
        super.setup();
        this.name = 'rollBehaviourDie';
    }

    setDefaultProperties() {
        this.behaviourNum = 1;
    }

    canAffect(player, context) {
        return player.isDummy && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        const behaviour = player.behaviour.getBehaviour(
            this.behaviourNum,
            player.chimeraPhase
        );
        return super.createEvent(
            'unnamedevent',
            { player: player, context: context, behaviourNum: this.behaviourNum },
            (event) => {
                behaviour.executeSide();
                context.game.addMessage(
                    '{0} resolves side action for behaviour {1}',
                    player,
                    event.behaviourNum
                );
            });
    }
}

module.exports = ResolveBehaviourSideAction;
