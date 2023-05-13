class PendingPlayer {
    constructor(id, name, isOwner, user,) {
        this.id = id;
        this.name = name;
        this.owner = isOwner;
        this.user = user;
        this.playerType = user.isDummy ? 'dummy' : null;
    }
}

module.exports = PendingPlayer;