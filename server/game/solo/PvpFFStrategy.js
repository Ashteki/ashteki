class PvpFFStrategy {
    constructor(player) {
        this.player = player;
    }

    execute(ffPrompt) {
        // accept a random selection of cards
        ffPrompt.menuCommand(this.player, 'done');
    }
}

module.exports = PvpFFStrategy;