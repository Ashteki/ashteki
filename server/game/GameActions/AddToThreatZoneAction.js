const PlayerAction = require('./PlayerAction');

class AddToThreatZoneAction extends PlayerAction {
    setup() {
        super.setup();
        this.name = 'addToThreatZone';
        this.effectMsg = 'moves a card to its threat zone';
    }

    setDefaultProperties() {
        this.amount = 1;
    }

    canAffect(player, context) {
        return this.amount !== 0 && player.isDummy && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent(
            'unnamedEvent',
            {
                player: player,
                amount: this.amount,
                context: context
            },
            (event) => {
                if (event.amount > 0) {
                    event.player.moveCardsToThreatZone(event.amount);
                }
            }
        );
    }
}

module.exports = AddToThreatZoneAction;
