const PlayerAction = require('./PlayerAction');

// triggers a chosendrawprompt for each player
class ChosenAmountDrawAction extends PlayerAction {
    constructor(properties) {
        super(properties);
        this.properties = properties;
        this.name = 'chosen draw';
        this.eventName = 'onChosenDraw';
        this.effect = 'chosen amount draw';
    }

    getEvent(player, context) {
        return super.createEvent('onChosenDraw', { player: player, context: context }, () => {
            // don't know why this needs addition of propertyCache (propFactory output,
            // but can deal with it later)
            context.game.promptForAdditionalDraw(this.propertyCache);
        });
    }

    canAffect() {
        return true;
    }
}
module.exports = ChosenAmountDrawAction;
