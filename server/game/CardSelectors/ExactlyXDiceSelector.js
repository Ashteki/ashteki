const BaseDieSelector = require('./BaseDieSelector.js');

class ExactlyXDiceSelector extends BaseDieSelector {
    constructor(numDice, properties) {
        super(properties);

        this.numDice = numDice;
    }

    getNumDice(context) {
        if (typeof this.numDice === 'function') {
            return this.numDice(context);
        }

        return this.numDice;
    }

    defaultActivePromptTitle(context) {
        let numDice = this.getNumDice(context);
        return numDice === 1
            ? 'Choose a die'
            : this.owner === 'self'
            ? 'Choose ' + numDice + ' dice'
            : 'Choose ' + numDice + " of your opponent's dice";
    }

    hasEnoughSelected(selectedDice, context) {
        return selectedDice.length === this.getNumDice(context);
    }

    hasReachedLimit(selectedDice, context) {
        return selectedDice.length >= this.getNumDice(context);
    }

    automaticFireOnSelect(context) {
        return this.getNumDice(context) === 1;
    }
}

module.exports = ExactlyXDiceSelector;
