class AnonymousSpectator {
    constructor() {
        this.name = 'Anonymous';
        this.buttons = [];
        this.menuTitle = 'Spectator mode';
    }

    isSpectator() {
        return true;
    }

    getCardSelectionState() {
        return {};
    }

    getDieSelectionState() {
        return {};
    }
}

module.exports = AnonymousSpectator;
