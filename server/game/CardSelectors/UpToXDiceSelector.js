const BaseDieSelector = require('./BaseDieSelector');

class UpToXDiceSelector extends BaseDieSelector {
    constructor(numDice, properties) {
        super(properties);

        this.numDice = numDice;
        this.optional = true;
        this.selectPrefix = properties.selectPrefix || 'Choose';
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
            ? this.owner === 'self'
                ? this.selectPrefix + ' a die'
                : this.selectPrefix + " an opponent's die"
            : this.owner === 'self'
            ? this.selectPrefix + ' up to ' + numDice + ' dice'
            : this.selectPrefix + ' up to ' + numDice + " of your opponent's dice";
    }

    hasReachedLimit(selectedDice, context) {
        return selectedDice.length >= this.getNumDice(context);
    }

    hasExceededLimit(selectedDice, context) {
        return selectedDice.length > this.getNumDice(context);
    }

    hasEnoughTargets() {
        return true;
    }
}

module.exports = UpToXDiceSelector;
