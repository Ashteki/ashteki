const PlayerAction = require('./PlayerAction');

class ChosenExhaustAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.cardType = 'any';
    }

    setup() {
        super.setup();
        this.name = 'exhaust';
        this.effectMsg = 'exhaust ' + this.amount + ' cards';
        this.cards = {};
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player: player }, () => {
            if (player.hand.length > 0) {
                let amount = Math.min(player.hand.length, this.amount);
                if (amount > 0) {
                    context.game.promptForSelect(player, {
                        activePromptTitle:
                            amount === 1
                                ? 'Choose a card to exhaust'
                                : {
                                      text: 'Choose {{amount}} cards to exhaust',
                                      values: { amount: amount }
                                  },
                        context: context,
                        mode: 'exactly',
                        numCards: amount,
                        cardType: this.cardType,
                        controller: player === context.player ? 'self' : 'opponent',
                        onSelect: (player, cards) => {
                            context.game.addMessage('{0} discards {1}', player, cards);
                            context.game.actions.exhaust().resolve(cards, context);
                            return true;
                        }
                    });
                }
            }
        });
    }
}

module.exports = ChosenExhaustAction;
