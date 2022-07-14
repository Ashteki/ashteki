const OpenInformationLocations = ['play area', 'spellboard', 'purged', 'discard'];

class CardVisibility {
    constructor(showHands) {
        this.showHands = showHands;
        this.rules = [
            (card) => this.isSpellRevealed(card),
            (card) => this.isPublicRule(card),
            (card) => this.isEffectRule(card),
            (card, player) => this.isControllerRule(card, player),
            (card, player) => this.isSpectatorRule(card, player)
        ];
    }

    isVisible(card, player) {
        return this.rules.some((rule) => rule(card, player));
    }

    isOpenInformation(card) {
        return OpenInformationLocations.includes(card.location);
    }

    addRule(rule) {
        this.rules.push(rule);
    }

    removeRule(rule) {
        this.rules = this.rules.filter((r) => r !== rule);
    }

    isPublicRule(card) {
        return OpenInformationLocations.includes(card.location) && !card.facedown;
    }

    isEffectRule(card) {
        return card.getEffects('visibleIn').some((effect) => effect === card.location);
    }

    isControllerRule(card, player) {
        return card.controller === player && (card.location !== 'draw deck' || player.showDeck);
    }

    isSpectatorRule(card, player) {
        return (
            this.showHands && player.isSpectator() && ['hand', 'archives'].includes(card.location)
        );
    }

    isSpellRevealed(card) {
        const revealedCards = [
            card.controller.phoenixborn,
            ...card.controller.cardsInPlay,
            ...card.controller.spellboard
        ];
        return revealedCards.some((spell) => spell.conjurations.some((c) => c.stub === card.id));
    }
}

module.exports = CardVisibility;
