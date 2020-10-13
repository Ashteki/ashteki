const BaseDieSelector = require('./BaseDieSelector');

class UpToXDiceSelector extends BaseDieSelector {
    constructor(numDice, properties) {
        super(properties);

        this.numDice = numDice;
        this.optional = true;
    }

    getNumDice(context) {
        if (typeof this.numDice === 'function') {
            return this.numDice(context);
        }

        return this.numDice;
    }

    defaultActivePromptTitle(context) {
        let numDice = this.getNumDice(context);
        // if (this.cardType.length === 1) {
        //     return numDice === 1
        //         ? 'Choose a ' + this.cardType[0]
        //         : { text: `Choose {{amount}} ${this.cardType[0]}s`, values: { amount: numDice } };
        // }

        return numDice === 1
            ? 'Choose a die'
            : { text: 'Choose {{amount}} dice', values: { amount: numDice } };
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
