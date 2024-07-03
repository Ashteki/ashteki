const BotDicePromptStrategy = require('./BotDicePromptStrategy');
const BotFFStrategy = require('./BotFFStrategy');
const BotTargetCardStrategy = require('./BotTargetCardStrategy');
const DummyPlayer = require('./DummyPlayer');

class BotPlayer extends DummyPlayer {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
        this.firstFiveStrategy = new BotFFStrategy(this);
        this.dicePromptStrategy = new BotDicePromptStrategy(this);
        this.targetCardStrategy = new BotTargetCardStrategy(this);
    }

    get confirmOneClick() {
        return false;
    }

    get isBot() {
        return true;
    }
}

module.exports = BotPlayer;