class PendingPlayer {
    constructor(id, name, isOwner, user) {
        this.id = id;
        this.name = name;
        this.owner = isOwner;
        this.user = user;
        this.isChimera = user.isChimera;
        this.isDragonborn = user.isDragonborn;
        this.isBot = user.isBot;
        this.isDummy = user.isDummy;
    }
}

module.exports = PendingPlayer;