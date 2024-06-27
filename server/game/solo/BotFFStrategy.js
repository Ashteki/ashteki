class BotFFStrategy {
    constructor(player) {
        this.player = player;
    }

    execute(prompt) {
        // done - accept FF preselect or fill with random cards
        prompt.handleDoneCommand(this.player);
    }
}

module.exports = BotFFStrategy;