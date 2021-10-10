const _ = require('underscore');
const SelectChoice = require('./SelectChoice.js');

class AbilityTargetSelect {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        if (!this.properties.choiceHandler) {
            for (const key of Object.keys(properties.choices)) {
                if (
                    typeof properties.choices[key] !== 'function' &&
                    !Array.isArray(properties.choices[key])
                ) {
                    properties.choices[key] = [properties.choices[key]];
                }
            }
        }

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
        } else keys = Object.keys(this.properties.choices);
        return keys.some((key) => this.isChoiceLegal(key, context));
    }

    isChoiceLegal(key, context) {
        let contextCopy = context.copy();
        contextCopy.selects[this.name] = new SelectChoice(key);
        if (this.name === 'target') {
            contextCopy.select = key;
        }

        if (
            context.stage === 'pretarget' &&
            this.dependentCost &&
            !this.dependentCost.canPay(contextCopy)
        ) {
            return false;
        }

        if (this.dependentTarget && !this.dependentTarget.hasLegalTarget(contextCopy)) {
            return false;
        }

        let choice = this.properties.choices[key];
        if (typeof choice === 'function') {
            return choice(contextCopy);
        }

        if (this.properties.choiceHandler) {
            return true;
        }

        return choice.some((gameAction) => gameAction.hasLegalTarget(contextCopy));
    }

    getGameAction(context) {
        if (!context.selects[this.name] || typeof this.properties.choices === 'function') {
            return [];
        }

        let choice = this.properties.choices[context.selects[this.name].choice];
        if (typeof choice !== 'function') {
            return choice.filter((gameAction) => gameAction.hasLegalTarget(context));
        }

        return [];
    }

    getAllLegalTargets(context) {
        return Object.keys(this.properties.choices).filter((key) =>
            this.isChoiceLegal(key, context)
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

        let player = context.player;
        if (this.properties.player && this.properties.player === 'opponent') {
            if (context.stage === 'pretarget') {
                targetResults.delayTargeting = this;
                return;
            }

            player = player.opponent;
        }

        let activePromptTitle = this.properties.activePromptTitle || 'Select one';

        let choices = [];
        if (typeof this.properties.choices === 'function') {
            choices = this.properties.choices(context);
        } else if (this.properties.choiceHandler) {
            choices = this.properties.choices;
        } else {
            choices = Object.keys(this.properties.choices).filter((key) =>
                this.isChoiceLegal(key, context)
            );
        }
        let handlers = _.map(choices, (choice) => {
            return () => {
                context.selects[this.name] = new SelectChoice(choice);
                if (this.name === 'target') {
                    context.select = choice;
                }
            };
        });
        if (this.properties.player !== 'opponent' && context.stage === 'pretarget') {
            if (!targetResults.noCostsFirstButton) {
                choices.push('Pay costs first');
                handlers.push(() => (targetResults.payCostsFirst = true));
            }

            choices.push('Cancel');
            handlers.push(() => (targetResults.cancelled = true));
        }

        if (choices.length === 1 && this.properties.choiceHandler) {
            this.properties.choiceHandler(choices[0]);
        } else if (handlers.length === 1) {
            handlers[0]();
        } else if (handlers.length > 1) {
            let waitingPromptTitle = '';
            if (context.stage === 'pretarget') {
                if (context.ability.abilityType === 'action') {
                    waitingPromptTitle = 'Waiting for opponent to take an action or pass';
                } else {
                    waitingPromptTitle = 'Waiting for opponent';
                }
            }

            context.game.promptWithHandlerMenu(player, {
                promptTitle: this.properties.title,
                waitingPromptTitle: waitingPromptTitle,
                activePromptTitle: activePromptTitle,
                context: context,
                source: this.properties.source || context.source,
                choices: choices,
                handlers: handlers,
                choiceHandler: this.properties.choiceHandler
            });
        }
    }

    checkTarget(context) {
        return (
            context.selects[this.name] &&
            this.isChoiceLegal(context.selects[this.name].choice, context) &&
            (!this.dependentTarget || this.dependentTarget.checkTarget(context))
        );
    }
}

module.exports = AbilityTargetSelect;
