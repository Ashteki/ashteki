const RevealAct = require("../../BaseActions/RevealAct");
const BehaviourCard = require("../../solo/BehaviourCard");

class VirosBehaviour1 extends BehaviourCard {
    getChimeraActions(behaviourRoll) {
        switch (behaviourRoll) {
            default:
                return [this.getReveal()];
        }
    }

    getReveal() {
        const target = this.owner.threatZone[0];
        return new RevealAct(target);
    }
}

VirosBehaviour1.id = 'viros-behaviour-1';

module.exports = VirosBehaviour1