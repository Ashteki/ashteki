class PlayerStateWriter {
    constructor(player) {
        this.player = player;
    }

    getState(player) {
        return this.player.getState(player);
    }
}

module.exports = PlayerStateWriter;
