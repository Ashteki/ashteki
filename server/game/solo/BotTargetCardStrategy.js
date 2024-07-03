
class BotTargetCardStrategy {
    constructor(player) {
        this.player = player;
    }

    execute(prompt, context) {
        prompt.doRandomSelection(context);

        return true;
    }
}

module.exports = BotTargetCardStrategy;