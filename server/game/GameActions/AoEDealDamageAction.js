const { BattlefieldTypes } = require('../../constants');
const PlayerAction = require('./PlayerAction');

class AoEDealDamageAction extends PlayerAction {
    setup() {
        super.setup();
        this.amount = 1;
        this.name = 'AoEDamage';
        this.cards = {};
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
            activePromptTitle: 'Choose a card to affect',
            waitingPromptTitle: 'Waiting for opponent to order AoE actions',
            // eslint-disable-next-line no-undef
            cardType: BattlefieldTypes,
            cardCondition: (card) => this.cards.includes(card),
            context: context,
            onSelect: (player, card) => {
                context.game.actions.dealDamage().resolve(card, context);
                this.cards = this.cards.filter((c) => c !== card);
                if (this.cards.length) {
                    this.promptForRemainingCards(context);
                }
                return true;
            }
        });
    }
}

module.exports = AoEDealDamageAction;
