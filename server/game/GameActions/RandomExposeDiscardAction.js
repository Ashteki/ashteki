const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

class RandomExposeDiscardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.location = 'discard';
        this.promptTitle = 'Random Discard Reveal';
        this.moveTo = '';
    }

    setup() {
        super.setup();
        this.name = 'discard-expose';
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player, context }, () => {
            let amount = Math.min(this.amount, player.discard.length);
            let cards = _.shuffle(player.discard).slice(0, amount);

            context.game.addMessage('{0} reveals {1} from their discard', player, cards);
            context.cardsRevealed = cards;
            if (this.moveTo === 'purge') {
                context.game.actions
                    .purge({
                        showMessage: true
                    })
                    .resolve(cards, context);
            }
            if (this.moveTo === 'hand') {
                context.game.actions
                    .moveCard({
                        destination: 'hand',
                        showMessage: true
                    })
                    .resolve(cards, context);
            }
        });
    }
}

module.exports = RandomExposeDiscardAction;
