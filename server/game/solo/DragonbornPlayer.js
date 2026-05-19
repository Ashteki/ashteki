const ChimeraPlayer = require('./ChimeraPlayer');

class DragonbornPlayer extends ChimeraPlayer {
    get isDragonborn() {
        return true;
    }

    get isChimera() {
        return false;
    }
    onFullDice(context) {
        this.game.actions
            .addStatusToken({ showMessage: true, shortMessage: true, warnMessage: true })
            .resolve(this.phoenixborn, context);
    }
}

module.exports = DragonbornPlayer;