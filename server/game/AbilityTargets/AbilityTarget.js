class AbilityTarget {
    constructor(properties) {
        this.properties = properties;
    }

    onCancel(targetResults) {
        if (targetResults.firstTarget || !this.properties.optional) {
            targetResults.cancelled = true;
        }
        targetResults.firstTarget = false;
    }
}

module.exports = AbilityTarget;
