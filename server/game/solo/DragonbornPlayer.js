const ChimeraPlayer = require('./ChimeraPlayer');

class DragonbornPlayer extends ChimeraPlayer {
    get isDragonborn() {
        return true;
    }
}

module.exports = DragonbornPlayer;