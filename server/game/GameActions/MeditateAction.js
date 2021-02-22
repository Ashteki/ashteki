const PlayerAction = require('./PlayerAction');

class MeditateAction extends PlayerAction {
    constructor(properties) {
        super(properties);
        this.name = 'meditate';
        this.eventName = 'onMeditate';
        this.effect = 'meditate';
        // this.defaultProperties = {
        //     canPass: true
        // };
    }

    defaultTargets(context) {
        return [context.player];
    }

    getEvent(player, context) {
        return super.createEvent('onMeditate', { player: player, context: context }, () => {
            player.spendSideAction();
            context.game.promptForMeditation();
        });
    }
}
module.exports = MeditateAction;
