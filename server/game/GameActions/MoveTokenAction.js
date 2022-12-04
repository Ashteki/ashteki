const CardGameAction = require('./CardGameAction');

class MoveTokenAction extends CardGameAction {
    constructor(propertyFactory, type = 'status') {
        super(propertyFactory);
        this.type = type;
        this.from = null;
        this.to = null;
    }

    setDefaultProperties() {
        this.amount = 1;
        this.all = false;
    }

    setup() {
        this.name = 'moveToken';
        this.targetType = [
            'Conjuration',
            'Ally',
            'Ready Spell',
            'Phoenixborn',
            'Alteration Spell',
            'Conjured Alteration Spell'
        ];

        let type = this.type === 'status' ? 'status token' : this.type + ' token';
        if (!this.all && this.amount > 1) {
            type += 's';
        }

        this.effectMsg = `move ${this.all ? 'all' : this.amount} ${type} from {1} to {2}`;
        this.effectArgs = [this.from, this.to];
    }

    getAmount(card) {
        return this.all ? card.tokens[this.type] || 0 : this.amount;
    }

    checkEventCondition(event) {
        return !!event.from.tokens[event.type] && super.checkEventCondition(event);
    }

    canAffect(card, context) {
        return (
            (this.all || this.amount > 0) &&
            (card.location === 'play area' || card.location === 'spellboard') &&
            super.canAffect(card, context)
        );
    }

    getEventArray(context) {
        const amount = this.getAmount(this.from);
        const events = [];

        events.push(
            context.game.actions
                .removeToken({ amount: amount }, this.type)
                .getEvent(this.from, context)
        );

        events.push(
            context.game.actions
                .addToken({ amount: amount }, this.type)
                .getEvent(this.to, context)
        );

        return events;
    }
}

module.exports = MoveTokenAction;
