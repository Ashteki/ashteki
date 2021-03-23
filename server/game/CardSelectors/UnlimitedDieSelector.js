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
}

module.exports = UnlimitedDieSelector;
