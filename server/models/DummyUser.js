const User = require("./User");

/**
 * Dummy user acts as a proxy for LOBBY
 */
class DummyUser extends User {
    constructor() {
        super({
            _id: 0,
            username: DummyUser.DUMMY_USERNAME
        })
    }

    static DUMMY_USERNAME = 'Chimera';
    get username() {
        return DummyUser.DUMMY_USERNAME;
    }

    get isDummy() {
        return true;
    }

    get gamesPlayed() {
        return 100;
    }

    hasUserBlocked() {
        return false;
    }
}


module.exports = DummyUser;
