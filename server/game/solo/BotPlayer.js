const DummyPlayer = require('./DummyPlayer');

class BotPlayer extends DummyPlayer {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
    }
}

module.exports = BotPlayer;