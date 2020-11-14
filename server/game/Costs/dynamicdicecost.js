const DiceCost = require('./DiceCost');

class DynamicDiceCost extends DiceCost {
    constructor(costFunc) {
        super({ diceReq: 'dynamic' });
        this.costFunc = costFunc;
    }

    getDiceReq(context) {
        return this.costFunc(context);
    }
}

module.exports = DynamicDiceCost;
