class ReplayHelper {
    constructor() {
        this.replayLog = [];
    }

    recordState(gameState) {
        this.replayLog.push(gameState);
    }

}

module.exports = ReplayHelper;
