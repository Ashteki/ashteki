const { BattlefieldTypes } = require('../../constants');
const PlayerAction = require('./PlayerAction');

class OrderedAoEAction extends PlayerAction {
    setup() {
        super.setup();
        this.amount = 1;
        this.name = 'OrderedAoE';
        this.cards = {};
        this.promptTitle = '';
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player2, context) {
        return super.createEvent('unnamedEvent', { player: context.player }, () => {
            this.cards = this.propertyCache.cards;

            if (this.cards.length > 0) {
                this.promptForRemainingCards(context);
            }
        });
    }

    promptForRemainingCards(context) {
        context.game.promptForSelect(context.player, {
            activePromptTitle: 'Choose order of AoE actions',
            waitingPromptTitle: 'Waiting for opponent to order AoE actions',
            promptTitle: this.propertyCache.promptTitle,
            // eslint-disable-next-line no-undef
            cardType: BattlefieldTypes,
            location: ['play area'],
            cardCondition: (card) => this.cards.includes(card),
            context: context,
            onSelect: (player, card) => {
                const step = this.propertyCache.gameAction.resolve(card, context);
                const e = context.game.getEvent('unnamedevent', {}, () => {
                    this.cards = this.cards.filter((c) => c !== card);
                    if (this.cards.length) {
                        this.promptForRemainingCards(context);
                    }
                });

                step.event.addSubEvent(e);
                return true;
            }
        });
    }
}

module.exports = OrderedAoEAction;
