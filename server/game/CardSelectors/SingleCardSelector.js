const { UpgradeCardTypes } = require('../../constants.js');
const BaseCardSelector = require('./BaseCardSelector.js');

class SingleCardSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);

        this.numCards = 1;
    }

    defaultActivePromptTitle() {
        if (this.cardType.length === 1) {
            if (UpgradeCardTypes.includes(this.cardType[0])) {
                return 'Choose an Alteration Spell';
            }
            return 'Choose a ' + this.cardType[0];
        }

        return 'Choose a card';
    }

    automaticFireOnSelect() {
        return true;
    }

    hasReachedLimit(selectedCards) {
        return selectedCards.length >= this.numCards;
    }

    hasExceededLimit(selectedCards) {
        return selectedCards.length > this.numCards;
    }

    formatSelectParam(cards) {
        return cards[0];
    }
}

module.exports = SingleCardSelector;
