const PlayerAction = require('./PlayerAction');

class ChosenExhaustAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.tokenCount = 1;
        this.cardType = 'any';
        this.cardCondition = null;
    }

    setup() {
        super.setup();
        this.name = 'exhaust';
        this.effectMsg = 'exhaust ' + this.amount + ' cards';
        this.cards = {};
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player: player }, () => {
            if (this.amount > 0) {
                context.game.promptForSelect(player, {
                    activePromptTitle:
                        this.amount === 1
                            ? 'Choose a card to exhaust'
                            : {
                                text: 'Choose {{amount}} cards to exhaust',
                                values: { amount: this.amount }
                            },
                    context: context,
                    mode: 'exactly',
                    numCards: this.amount,
                    cardType: this.cardType,
                    cardCondition: this.cardCondition,
                    controller: player === context.player ? 'self' : 'opponent',
                    onSelect: (player, cards) => {
                        context.game.addMessage('{0} exhausts {1}', player, cards);
                        context.game.actions
                            .exhaust({
                                amount: this.tokenCount
                            })
                            .resolve(cards, context);
                        return true;
                    }
                });
            }
        });
    }
}

module.exports = ChosenExhaustAction;
