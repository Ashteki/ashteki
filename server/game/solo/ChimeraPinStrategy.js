class ChimeraPinStrategy {
    constructor(player) {
        this.player = player;
    }

    execute(prompt) {
        // accept default behaviour
        prompt.setPlayerComplete(this.player);
    }
}

module.exports = ChimeraPinStrategy;