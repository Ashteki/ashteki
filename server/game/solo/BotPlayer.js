const BotFFStrategy = require('./BotFFStrategy');
const DummyPlayer = require('./DummyPlayer');

class BotPlayer extends DummyPlayer {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
        this.firstFiveStrategy = new BotFFStrategy(this);

    }

    get confirmOneClick() {
        return false;
    }

    get isBot() {
        return true;
    }
}

module.exports = BotPlayer;