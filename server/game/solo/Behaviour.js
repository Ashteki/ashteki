class Behaviour {
    constructor(value, text, handler) {
        this.value = value;
        this.text = text;
        this.handler = handler;
    }

    execute() {
        this.handler();
    }

    executeSide() {
        return;
    }

    getShortSummary() {
        return { value: this.value, text: this.text };
    }
}

module.exports = Behaviour;
