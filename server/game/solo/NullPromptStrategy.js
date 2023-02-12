class NullPromptStrategy {
    constructor(player, command) {
        this.player = player;

        this.nullCommand = command;
    }

    execute(prompt) {
        prompt.menuCommand(this.player, this.nullCommand);
    }
}

module.exports = NullPromptStrategy;