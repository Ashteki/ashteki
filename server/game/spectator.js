class Spectator {
    constructor(id, user) {
        this.user = user;
        this.name = this.user.username;
        this.emailHash = this.user.emailHash;
        this.id = id;

        this.buttons = [];
        this.menuTitle = 'Spectator mode';
        this.lobbyId = undefined;
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

module.exports = Spectator;
