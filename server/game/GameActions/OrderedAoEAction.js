const { BattlefieldTypes } = require('../../constants');
const GameAction = require('./GameAction');
// const CardGameAction = require('./CardGameAction');

class OrderedAoEAction extends GameAction {
    setup() {
        super.setup();
        this.amount = 1;
        this.name = 'OrderedAoE';
        this.cards = {};
        this.promptTitle = '';
    }

    hasLegalTarget(context) {
        return true;
        // this.update(context);
        // return this.gameAction.hasLegalTarget(context);
    }

    getEventArray(context) {
        return [
            super.createEvent('unnamedEvent', { player: context.player }, () => {
                this.cards = this.target;

                if (this.cards.length > 0) {
                    this.promptForRemainingCards(context);
                }
            })
        ];
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
                this.propertyCache.gameAction.resolve(card, context);
                this.cards = this.cards.filter((c) => c !== card);
                if (this.cards.length) {
                    this.promptForRemainingCards(context);
                }
                return true;
            }
        });
    }
}

module.exports = OrderedAoEAction;
