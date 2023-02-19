class ChimeraDefenderStrategy {
    constructor(player) {
        this.player = player;
    }

    execute(prompt) {
        // accept default behaviour
        prompt.complete();
    }
}

module.exports = ChimeraDefenderStrategy;