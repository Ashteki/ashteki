class ChimeraFFStrategy {
    constructor(player) {
        this.player = player;
    }

    execute(prompt) {
        prompt.setPlayerComplete(this.player);
    }
}

module.exports = ChimeraFFStrategy;