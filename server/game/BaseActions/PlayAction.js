const BasePlayAction = require('./BasePlayAction');

class PlayAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this action';
    }

    displayMessage(context) {
        context.game.addMessage('{0} plays {1}', context.player, context.source);
    }

    executeHandler(context) {
        context.player.moveCard(context.source, 'being played');
        super.executeHandler(context);
        context.game.queueSimpleStep(() => {
            if (context.source.location === 'being played') {
                let location =
                    context.source.mostRecentEffect('actionCardLocationAfterPlay') || 'discard';
                context.source.owner.moveCard(context.source, location);
            }
        });
    }

    getWarnings(context) {
        return this.card.playWarning && this.card.playWarning(context);
    }
}

module.exports = PlayAction;
