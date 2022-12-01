const Clock = require('./Clock');

class Timer extends Clock {
    constructor(player, time) {
        super(player, time);
        this.mode = 'down';
        this.name = 'Timer';
    }

    timeRanOut() {
        this.player.game.addAlert(
            'warning',
            'TIMER - The allowed game time has ended. The game will enter SUDDEN DEATH mode at the beginning of the next first player turn'
        );
        // this.player.game.addMessage("The game timerimer has expired", this.player);
    }
}

module.exports = Timer;
