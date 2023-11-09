const { BattlefieldTypes } = require('../../constants');
const PlayerAction = require('./PlayerAction');

class ChosenDestroyAction extends PlayerAction {
    setup() {
        super.setup();
        this.name = 'chosenDestroy';
        this.effectMsg = 'make {0} choose to destroy a card';
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
                    activePromptTitle: 'Choose a card to destroy',
                    cardType: BattlefieldTypes,
                    context: context,
                    // 'self' / 'opponent' settings are in context of context.player
                    controller: context.player === event.player ? 'self' : 'opponent',
                    onSelect: (player, cards) => {
                        context.game.addMessage('{0} chooses to destroy {1}', player, cards);
                        context.game.actions.destroy().resolve(cards, context);
                        return true;
                    }
                });
            }
        });
    }
}

module.exports = ChosenDestroyAction;
