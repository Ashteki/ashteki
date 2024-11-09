const PlayerAction = require('./PlayerAction');

class SummonAction extends PlayerAction {
    setDefaultProperties() {
        this.count = 1;
        this.conjuration = null;
        this.leftmost = false;
        this.rider = null;
        // this.opponentControls = false;
        // this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'summon';
    }

    defaultTargets(context) {
        return context.player;
    }

    // canAffect(player, context) {
    //     return !!player.actions.side && super.canAffect(player, context);
    // }

    update(context) {
        super.update(context);
        // get card
        this.cards = context.source.owner.archives
            .filter((c) => c.id === this.conjuration)
            .slice(0, this.count);
        // this.effectArgs = [this.cards];
        context.summoned = this.cards;
    }

    getEvent(player, context) {
        const summonEvent = super.createEvent('onSummon', {
            player: player,
            context: context,
            cards: this.cards
        });
        if (this.cards && this.cards.length) {
            for (const card of this.cards) {
                const action = context.game.actions.putIntoPlay({
                    target: card,
                    showMessage: true,
                    opponentControls: context.target?.name === player.opponent.name,
                    leftmost: this.leftmost,
                    placeUnder: this.rider
                });

                context.game.queueSimpleStep(() =>
                    context.game.openEventWindow(action.getEventArray(context))
                );
            }
        }
        return summonEvent;
    }

    canAffect(target, context) {
        return this.cards && this.cards.length && super.canAffect(target, context);
    }
}

module.exports = SummonAction;
