const _ = require('underscore');
const SelectChoice = require('./SelectChoice.js');

class AbilityTargetPlayer {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        // if (!this.properties.choiceHandler) {
        //     for (const key of Object.keys(properties.choices)) {
        //         if (
        //             typeof properties.choices[key] !== 'function' &&
        //             !Array.isArray(properties.choices[key])
        //         ) {
        //             properties.choices[key] = [properties.choices[key]];
        //         }
        //     }
        // }
        this.choices = ['Opponent', 'Me'];


        this.dependentTarget = null;
        this.dependentCost = null;
        if (this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(
                (target) => target.name === this.properties.dependsOn
            );
            dependsOnTarget.dependentTarget = this;
        }
    }

    canResolve(context) {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    resetGameActions() {
        for (let action of this.properties.gameAction) {
            action.reset();
        }
    }

    hasLegalTarget(context) {
        let keys = [];
        if (typeof this.properties.choices === 'function') {
            keys = this.properties.choices(context);
        } else keys = this.choices;
        return keys.some((key) => this.isChoiceLegal(key, context));
    }

    isChoiceLegal(key, context) {
        let contextCopy = context.copy();
        contextCopy.selects[this.name] = new SelectChoice(key);
        if (this.name === 'target') {
            contextCopy.select = key;
        }

        if (this.dependentTarget && !this.dependentTarget.hasLegalTarget(contextCopy)) {
            return false;
        }

        return true;
    }

    getGameAction(context) {
        return this.properties.gameAction.filter((gameAction) =>
            gameAction.hasLegalTarget(context)
        );
    }

    resolve(context, targetResults) {
        if (
            targetResults.cancelled ||
            targetResults.payCostsFirst ||
            targetResults.delayTargeting
        ) {
            return;
        }

        if (this.properties.autoTarget) {
            const autoTarget = this.properties.autoTarget(context);
            let checkArray = Array.isArray(autoTarget) ? autoTarget : [autoTarget];
            const allTargetsValid = checkArray.every((t) =>
                [context.player, context.player.opponent].includes(t)
            );
            if (allTargetsValid) {
                this.setSelectedPlayer(context, autoTarget);
            } else {
                targetResults.cancelled = true;
            }
            return;
        }

        // if (typeof this.properties.choices === 'function') {
        //     choices = this.properties.choices(context);
        // }

        context.game.promptWithHandlerMenu(context.player, {
            promptTitle: this.properties.title,
            waitingPromptTitle: 'Waiting for opponent',
            activePromptTitle: this.properties.activePromptTitle,
            context: context,
            source: this.properties.source || context.source,
            choices: this.choices,
            choiceHandler: (option) =>
                this.setSelectedPlayer(
                    context,
                    option === this.choices[0] ? context.player.opponent : context.player
                )
        });
    }

    setSelectedPlayer(context, player) {
        context.targets[this.name] = player;
        if (this.name === 'target') {
            context.target = player;
        }
    }

    checkTarget(context) {
        if (!context.targets[this.name]) {
            return false;
        }

        let players = context.targets[this.name];
        if (!Array.isArray(players)) {
            players = [players];
        }

        return (
            players.every((player) => [context.player, context.player.opponent].includes(player)) &&
            (!this.dependentTarget || this.dependentTarget.checkTarget(context))
        );
    }
}

module.exports = AbilityTargetPlayer;
