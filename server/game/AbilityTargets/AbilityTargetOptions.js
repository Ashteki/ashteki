class AbilityTargetOptions {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        this.options = properties.options;
        this.dependentTarget = null;

        if (this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(
                (target) => target.name === this.properties.dependsOn
            );
            dependsOnTarget.dependentTarget = this;
        }
        this.handler = properties.handler || this.defaultHandler;
    }

    getOptions(context) {
        let options = this.options;

        if (typeof options === 'function') {
            options = options(context);
        }

        if (!Array.isArray(options)) {
            return [options];
        }

        return options;
    }

    canResolve(context) {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    resetGameActions() { }

    hasLegalTarget(context) {
        return !!this.getOptions(context).length;
    }

    getGameAction() {
        return [];
    }

    getAllLegalTargets(context) {
        return this.getOptions(context);
    }

    resolve(context, targetResults) {
        if (
            targetResults.cancelled ||
            targetResults.payCostsFirst ||
            targetResults.delayTargeting
        ) {
            return;
        }

        let player = context.player;
        if (this.properties.player && this.properties.player === 'opponent') {
            if (context.stage === 'pretarget') {
                targetResults.delayTargeting = this;
                return;
            }

            player = player.opponent;
        }

        let promptTitle = this.properties.activePromptTitle || 'Choose an option';

        const myOptions = this.getOptions(context);

        if (myOptions.length === 1) {
            context.option = this.handler(myOptions[0]);
        } else {
            context.game.promptWithOptionsMenu(player, {
                activePromptTitle: promptTitle,
                waitingPromptTitle: 'Waiting for opponent',
                source: this.properties.source || context.source,
                options: myOptions,
                optionsHandler: (option) => (context.option = this.handler(option))
            });
        }
    }

    defaultHandler = (option) => option;
}

module.exports = AbilityTargetOptions;
