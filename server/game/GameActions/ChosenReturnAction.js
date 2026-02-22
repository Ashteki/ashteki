const PlayerAction = require('./PlayerAction');

class ChosenReturnAction extends PlayerAction {
    constructor(properties) {
        super(properties);
        this.properties = properties;
        this.cardType = properties.cardType;
        this.cardCondition = properties.cardCondition || (() => true);
    }

    setup() {
        super.setup();
        this.name = 'chosenReturn';
        this.effectMsg = 'make {0} choose to return a card to hand';
        this.destination = 'hand';
        this.cards = {};
    }

    canAffect(player, context) {
        if (player.unitsInPlay.length === 0) {
            return false;
        }

        return super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player: context.target }, (event) => {
            if (event.player.unitsInPlay.length > 0) {
                context.game.promptForSelect(event.player, {
                    activePromptTitle: 'Choose a ready spell to return to your hand',
                    cardType: this.cardType,
                    cardCondition: this.cardCondition,
                    context: context,
                    // 'self' / 'opponent' settings are in context of context.player
                    controller: context.player === event.player ? 'self' : 'opponent',
                    onSelect: (player, cards) => {
                        context.game.addMessage('{0} chooses to return {1} to hand', player, cards);
                        context.game.actions.returnToHand().resolve(cards, context);
                        return true;
                    }
                });
            }
        });
    }
}

module.exports = ChosenReturnAction;
