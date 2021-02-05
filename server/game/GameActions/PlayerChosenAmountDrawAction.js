const PlayerAction = require('./PlayerAction');

// triggers a chosendrawprompt for each player
class PlayerChosenAmountDrawAction extends PlayerAction {
    constructor(properties) {
        super(properties);
        this.properties = properties;
        this.amount = properties.amount;
        this.name = 'chosen draw';
        this.eventName = 'onChosenDraw';
        this.effect = 'draw a chosen amount';
    }

    getEvent(player, context) {
        return super.createEvent('onChosenDraw', { player: player, context: context }, (event) => {
            // don't know why this needs addition of propertyCache (propFactory output,
            // but can deal with it later)

            const maxValues = {};
            maxValues[event.player.uuid] = this.amount;
            maxValues[event.player.opponent.uuid] = 0;
            let drawParams = {
                maxValues: maxValues,
                remainderDamages: false,
                promptTitle: this.properties.promptTitle || 'Draw how many?'
            };

            context.game.promptForAdditionalDraw(drawParams);
        });
    }

    canAffect() {
        return true;
    }
}
module.exports = PlayerChosenAmountDrawAction;
