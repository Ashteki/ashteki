const Behaviour = require('./Behaviour');

class SplitBehaviour extends Behaviour {
    constructor(value, text, mainHandler, sideHandler) {
        super(value, text);
        this.value = value;
        this.text = text;
        this.mainHandler = mainHandler;
        this.sideHandler = sideHandler;
    }

    execute() {
        this.sideHandler();
        this.mainHandler();
    }

    executeSide() {
        this.sideHandler();
    }
}

module.exports = SplitBehaviour;
