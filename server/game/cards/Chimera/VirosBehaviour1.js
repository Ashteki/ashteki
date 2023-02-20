const RevealAct = require("../../BaseActions/RevealAct");
const BehaviourCard = require("../../solo/BehaviourCard");

class VirosBehaviour1 extends BehaviourCard {
    getChimeraHandlers(behaviourRoll) {
        switch (behaviourRoll) {
            case 1:
            case 2:
                return [this.getRevealHandler()];
            case 3:
            case 4:
                return [this.canAttack() ? this.getAttackHandler() : this.getRevealHandler()];
            case 5:
            case 6:
                // Main: Reveal. Attack with revealed aspect
                // TODO: use revealed aspect
                return [this.getRevealHandler(), this.getAttackHandler()];
            case 7:
            case 8:
            case 9:
            // Side: Target opposing player must lower 2 non-basic dice in their active pool one level.
            // Main: Reveal
            case 10:
            case 11:
            // Side: Raise 1 basic rage die one level
            // Main: Reveal
            case 12:
            // Side: Place 1 Red Rains token on the Chimera.
            // Main: Reveal
            default:
                return [this.getRevealHandler(), this.getAttackHandler()];
        }
    }

    getRevealHandler() {
        const target = this.owner.threatZone[0];
        const act = new RevealAct(target);
        return () => this.game.resolveAbility(act.createContext(this.owner));
    }

    canAttack() {
        return this.owner.canAttack();
    }

    getAttackHandler() {
        return () => this.owner.doAttack();
    }
}

VirosBehaviour1.id = 'viros-behaviour-1';

module.exports = VirosBehaviour1