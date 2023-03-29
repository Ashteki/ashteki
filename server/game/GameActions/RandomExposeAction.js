const PlayerAction = require('./PlayerAction');
const _ = require('underscore');

class RandomExposeAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        // hand or archives
        this.location = 'hand';
    }

    setup() {
        super.setup();
        this.name = 'expose';
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', { player, context }, () => {
            let amount = Math.min(this.amount, player.hand.length);
            let cards = _.shuffle(player.hand).slice(0, amount);

            context.game.addMessage('{0} reveals {1} from their hand', player, cards);
        });
    }
}

module.exports = RandomExposeAction;
