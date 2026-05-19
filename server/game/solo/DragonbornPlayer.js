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

    triggerProgressAbility() {
        const ultAbility = this.ultimate.getProgressAbility(this.chimeraPhase);
        this.game.cardUsed(this.ultimate.createSnapshot(), this);
        const context = ultAbility.createContext(this);
        this.game.resolveAbility(context);
    }

}

module.exports = DragonbornPlayer;