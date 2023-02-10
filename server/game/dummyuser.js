const User = require("../models/User");

class DummyUser extends User {
    constructor() {
        super({
            _id: 0,
            username: DummyUser.DUMMY_USERNAME
        })
    }

    static DUMMY_USERNAME = 'dummy'
    get username() {
        return DummyUser.DUMMY_USERNAME;
    }

    hasUserBlocked() {
        return false;
    }
}


module.exports = DummyUser;
