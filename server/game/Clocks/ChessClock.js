const Clock = require('./Clock');

class ChessClock extends Clock {
    constructor(player, time) {
        super(player, time);
        this.mode = 'stop';
        this.name = 'Chess Clock';
    }

    start() {
        if (this.timeLeft > 0) {
            this.mode = 'down';
            super.start();
        }
    }

    stop() {
        if (this.mode !== 'stop') {
            super.stop();
            this.mode = 'stop';
        }
    }

    timeRanOut() {
        this.player.game.addAlert(
            'danger',
            "{0}'s clock has run out - they will lose at the end of this turn",
            this.player
        );
        this.player.outOfTime();
    }
}

module.exports = ChessClock;
