class BaseStep {
    constructor(game) {
        this.game = game;
    }

    /**
     * Entry point to the Step when on the pipeline. Gets called at every game loop until complete or cancelled
     */
    continue() { }

    onCardClicked() {
        return false;
    }

    onCardPileClicked() {
        return false;
    }

    onCardDragged() {
        return false;
    }

    onDieClicked() {
        return false;
    }

    onMenuCommand() {
        return false;
    }

    getDebugInfo() {
        return this.constructor.name;
    }
}

module.exports = BaseStep;
