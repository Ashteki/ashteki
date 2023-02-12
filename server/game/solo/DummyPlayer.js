const Player = require("../player");
const NullPromptStrategy = require("./NullPromptStrategy");

class DummyPlayer extends Player {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
        this.firstFiveStrategy = new NullPromptStrategy(this, 'done');
        this.disStrategy = new NullPromptStrategy(this, 'no');
    }

    get isDummy() {
        return true;
    }

    get ffStrategy() {
        return this.firstFiveStrategy;
    }

    get discardStrategy() {
        return this.disStrategy
    }
}

module.exports = DummyPlayer;