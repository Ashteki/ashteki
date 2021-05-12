const CardGameAction = require('./CardGameAction');

class AddTokenAction extends CardGameAction {
    constructor(propertyFactory, type = 'damage') {
        super(propertyFactory);
        this.type = type;
        this.showMessage = false;
    }

    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        this.name = 'addToken';
        this.targetType = ['Ally', 'Conjuration', 'Ready Spell', 'Phoenixborn', 'Alteration Spell'];
        this.effectMsg = 'place ' + this.amount + ' ' + this.type + ' on {0}';
    }

    canAffect(card, context) {
        return (
            this.amount > 0 &&
            (card.location === 'play area' || card.location === 'spellboard') &&
            super.canAffect(card, context)
        );
    }

    getEvent(card, context) {
        return super.createEvent(
            'onAddToken',
            { card: card, context: context, amount: this.amount, type: this.type },
            (event) => {
                if (this.showMessage) {
                    context.game.addMessage(
                        '{0} places ' + this.amount + ' ' + this.type + ' on {1}',
                        context.player,
                        event.card
                    );
                }
                card.addToken(this.type, this.amount);
            }
        );
    }
}

module.exports = AddTokenAction;
