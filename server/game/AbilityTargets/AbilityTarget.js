class AbilityTarget {
    constructor(properties) {
        this.properties = properties;
    }

    resetGameActions() {
        for (let action of this.properties.gameAction) {
            action.reset();
        }
    }
    onCancel(targetResults) {
        if (
            // targetResults.firstTarget ||
            !this.properties.optional
        ) {
            targetResults.cancelled = true;
        } else {
            this.resetGameActions();
        }
        targetResults.firstTarget = false;
    }
}

module.exports = AbilityTarget;
