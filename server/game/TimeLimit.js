const moment = require('moment');

class TimeLimit {
    constructor(game, timeLimit) {
        this.game = game;
        this.started = false;
        this.startedAt = null;

        this.timeLimitInMinutes = timeLimit;
        this.isTimeLimitReached = false;
    }

    startTimer() {
        if (!this.started) {
            this.started = true;
            this.startedAt = new Date();
            this.timer = setInterval(() => {
                this.checkForTimeLimitReached();
            }, 1000);
        }
    }

    stopTimer() {
        this.started = false;
        this.startedAt = new Date();
        this.timer = null;
    }

    checkForTimeLimitReached() {
        if (this.game.useGameTimeLimit && !this.isTimeLimitReached) {
            let differenceBetweenStartOfTimerAndNow = moment.duration(
                moment().diff(this.startedAt)
            );
            if (differenceBetweenStartOfTimerAndNow.asSeconds() / 60 >= this.timeLimitInMinutes) {
                // this.game.addAlert(
                //     'warning',
                //     );
                //     'Time up!  The game will enter SUDDEN DEATH mode at the beginning of the next first player turn'
                this.isTimeLimitReached = true;
                this.started = false;
                this.game.timeExpired();
            }
        } else if (this.isTimeLimitReached && this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}

module.exports = TimeLimit;
