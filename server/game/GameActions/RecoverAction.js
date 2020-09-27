const RemoveTokenAction = require('./RemoveTokenAction.js');

class RecoverAction extends RemoveTokenAction {
    constructor(propertyFactory) {
        super(propertyFactory);
        this.type = 'damage';
    }

    getAmount(card) {
        return card.recover;
    }
}

module.exports = RecoverAction;
