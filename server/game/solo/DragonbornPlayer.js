const ChimeraDefenceStrategy = require('./ChimeraDefenceStrategy');
const ChimeraPlayer = require('./ChimeraPlayer');

class DragonbornPlayer extends ChimeraPlayer {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
        this.defenderStrategy = new ChimeraDefenceStrategy(this, game);
        this.stamina = 3;
    }
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

    applyFatigue() {
        super.applyFatigue();
        this.phoenixborn.exhaust();
    }

    unExhaustReadySpell() {
        const unexhaustAbility = this.ultimate.getUnexhaustAbility();
        const context = unexhaustAbility.createContext(this);
        this.game.resolveAbility(context);
    }
}

module.exports = DragonbornPlayer;
