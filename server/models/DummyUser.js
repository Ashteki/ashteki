const User = require("./User");

/**
 * Dummy user acts as a proxy for LOBBY
 */
class DummyUser extends User {
    constructor(username) {
        super({
            _id: 0,
            username: username
        })
    }

    static CHIMERA_USERNAME = 'Chimera';
    static DRAGONBORN_USERNAME = 'Dragonborn';
    static BOT_USERNAME = 'Bound Soul';

    get isDummy() {
        return true;
    }

    get isChimera() {
        return this.username === DummyUser.CHIMERA_USERNAME;
    }

    get isDragonborn() {
        return this.username === DummyUser.DRAGONBORN_USERNAME;
    }

    get isBot() {
        return this.username === DummyUser.BOT_USERNAME;
    }

    get gamesPlayed() {
        return 100;
    }

    hasUserBlocked() {
        return false;
    }
}


module.exports = DummyUser;
