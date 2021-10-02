const PlayerAction = require('./PlayerAction');

class SummonAction extends PlayerAction {
    setDefaultProperties() {
        this.count = 1;
        this.conjuration = null;
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
        this.cards = context.player.archives
            .filter((c) => c.id === this.conjuration)
            .slice(0, this.count);
        // this.effectArgs = [this.cards];
    }

    getEvent(player, context) {
        const summonEvent = super.createEvent('onSummon', { player: player, context: context });
        if (this.cards && this.cards.length) {
            const gameAction = context.game.actions.putIntoPlay({
                target: this.cards,
                showMessage: true
            });
            for (let event of gameAction.getEventArray(context)) {
                summonEvent.addChildEvent(event);
            }
        }
        return summonEvent;
    }
}

module.exports = SummonAction;
