const CardGameAction = require('./CardGameAction');

class RemoveAllTokensAction extends CardGameAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.showMessage = false;
    }

    setDefaultProperties() { }

    setup() {
        this.name = 'removeToken';
        this.targetType = ['Conjuration', 'Ally', 'Ready Spell', 'Phoenixborn', 'Alteration Spell'];

        this.effectMsg = `remove all tokens from {0}`;
    }

    canAffect(card, context) {
        return (
            (card.location === 'play area' || card.location === 'spellboard') &&
            super.canAffect(card, context)
        );
    }

    getEvent(card, context) {
        return super.createEvent('onRemoveToken', { card: card, context: context }, (event) => {
            card.removeAllTokens();
            if (this.showMessage) {
                context.game.addMessage(
                    `{0} removes all tokens from {1}`,
                    context.player,
                    event.card
                );
            }
        });
    }
}

module.exports = RemoveAllTokensAction;
