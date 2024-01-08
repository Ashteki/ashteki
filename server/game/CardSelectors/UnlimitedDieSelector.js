const Dice = require('../dice.js');
const BaseDieSelector = require('./BaseDieSelector.js');

class UnlimitedDieSelector extends BaseDieSelector {
    hasEnoughSelected() {
        return true;
    }

    hasReachedLimit() {
        return false;
    }

    hasEnoughTargets() {
        return true;
    }

    canTarget(die, context) {
        if (!Dice.findADie([die], this.diceReq[0])) {
            return false;
        }


        return super.canTarget(die, context);
    }
}

module.exports = UnlimitedDieSelector;
