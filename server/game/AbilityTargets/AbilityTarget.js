class AbilityTarget {
    constructor(name, properties) {
        this.name = name;

        this.properties = properties;
    }

    resetGameActions() {
        for (let action of this.properties.gameAction) {
            action.reset();
        }
    }

    setSelected(context, item) {
        context.targets[this.name] = item;
        if (this.name === 'target') {
            context.target = item;
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
