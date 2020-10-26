const BaseDieSelector = require('./BaseDieSelector.js');

class SingleDieSelector extends BaseDieSelector {
    constructor(properties) {
        super(properties);

        this.numDice = 1;
    }

    defaultActivePromptTitle() {
        if (this.dieType.length === 1) {
            return `Choose a ${this.dieType} die`;
        }

        return 'Choose a die';
    }

    automaticFireOnSelect() {
        return true;
    }

    hasReachedLimit(selected) {
        return selected.length >= this.numDice;
    }

    hasExceededLimit(selected) {
        return selected.length > this.numDice;
    }

    formatSelectParam(dice) {
        return dice[0];
    }
}

module.exports = SingleDieSelector;
