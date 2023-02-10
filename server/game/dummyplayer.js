class DummyPlayer {
    static DUMMY_USERNAME = 'dummy'
    get username() {
        return DummyPlayer.DUMMY_USERNAME;
    }

    hasUserBlocked() {
        return false;
    }
}


module.exports = DummyPlayer;
