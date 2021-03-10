const CardGameAction = require('./CardGameAction');

class RemoveTokenAction extends CardGameAction {
    constructor(propertyFactory, type = 'status') {
        super(propertyFactory);
        this.type = type;
        this.showMessage = false;
    }

    setDefaultProperties() {
        this.amount = 1;
        this.all = false;
    }

    setup() {
        this.name = 'removeToken';
        this.targetType = ['Conjuration', 'Ally', 'Ready Spell', 'Phoenixborn', 'Alteration Spell'];

        let type = this.type === 'status' ? 'status token' : this.type;
        if (!this.all && this.amount > 1) {
            type += 's';
        }

        this.effectMsg = `remove ${this.all ? 'all' : this.amount} ${type} from {0}`;
    }

    getAmount(card) {
        return this.all ? card.tokens[this.type] || 0 : this.amount;
    }

    checkEventCondition(event) {
        return !!event.card.tokens[event.type] && super.checkEventCondition(event);
    }

    canAffect(card, context) {
        return (
            (this.all || this.amount > 0) &&
            (card.location === 'play area' || card.location === 'spellboard') &&
            super.canAffect(card, context)
        );
    }

    getEvent(card, context) {
        return super.createEvent(
            'onRemoveToken',
            { type: this.type, card: card, context: context, amount: this.getAmount(card) },
            (event) => {
                card.removeToken(event.type, event.amount);
                if (this.showMessage) {
                    context.game.addMessage(
                        `{0} removes {1} {2} tokens from {3}`,
                        context.player,
                        this.all ? 'all' : event.amount,
                        event.type,
                        event.card
                    );
                }
            }
        );
    }
}

module.exports = RemoveTokenAction;
