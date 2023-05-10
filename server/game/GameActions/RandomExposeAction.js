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
            const hand = player.getHand();
            let amount = Math.min(this.amount, hand.length);
            let cards = _.shuffle(hand).slice(0, amount);

            context.game.addMessage('{0} reveals {1} from their hand', player, cards);
            context.game.queueUserAlert(context, {
                // timed: true,
                self: true,
                promptTitle: 'Three-Eyed Owl',
                menuTitle: player.name + ' reveals ' + cards.map((c) => c.name).join(', '),
                controls: [
                    {
                        type: 'targeting',
                        source: context.source.getShortSummary(),
                        targets: cards.map(c => c.getShortSummary())
                    }
                ]
            });
        });
    }
}

module.exports = RandomExposeAction;
