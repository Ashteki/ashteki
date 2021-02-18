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
        if (player.cardsInPlay.length === 0) {
            return false;
        }

        return super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player: player }, () => {
            if (player.cardsInPlay.length > 0) {
                context.game.promptForSelect(player, {
                    activePromptTitle: 'Choose a card to destroy',
                    // eslint-disable-next-line no-undef
                    cardType: BattlefieldTypes,
                    context: context,
                    controller: player === context.player ? 'self' : 'opponent',
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
