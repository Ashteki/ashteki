const Player = require("../player");
const PvpFFStrategy = require("./PvpFFStrategy");

class DummyPlayer extends Player {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
        this.firstFiveStrategy = new PvpFFStrategy(this);
    }

    get isDummy() {
        return true;
    }

    get ffStrategy() {
        return this.firstFiveStrategy;
    }

}

module.exports = DummyPlayer;