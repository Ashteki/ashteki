const _ = require('underscore');
const DieSelector = require('../DieSelector');

class AbilityTargetDie {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        for (let gameAction of this.properties.gameAction) {
            gameAction.setDefaultTarget((context) => context.targets[name]);
        }

        this.selector = this.getSelector(properties);
        this.dependentTarget = null;
        this.dependentCost = null;
        if (this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(
                (target) => target.name === this.properties.dependsOn
            );
            dependsOnTarget.dependentTarget = this;
        }
    }

    getSelector(properties) {
        let dieCondition = (die, context) => {
            let contextCopy = context.copy();
            contextCopy.targets[this.name] = this.selector.formatSelectParam([die]);
            if (this.name === 'target') {
                contextCopy.target = contextCopy.targets[this.name];
            }

            this.resetGameActions();
            return (
                (!properties.dieCondition || properties.dieCondition(die, contextCopy)) &&
                (properties.gameAction.length === 0 ||
                    properties.gameAction.some((gameAction) =>
                        gameAction.hasLegalTarget(contextCopy)
                    ))
            );
        };

        return DieSelector.for(
            Object.assign({}, properties, { dieCondition: dieCondition, targets: true })
        );
    }

    canResolve(context) {
        // if this depends on another target, that will check hasLegalTarget already
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    resetGameActions() {
        for (let action of this.properties.gameAction) {
            action.reset();
        }
    }

    hasLegalTarget(context) {
        return this.selector.hasEnoughTargets(context);
    }

    getGameAction(context) {
        return this.properties.gameAction.filter((gameAction) =>
            gameAction.hasLegalTarget(context)
        );
    }

    getAllLegalTargets(context) {
        return this.selector.getAllLegalTargets(context);
    }

    resolve(context, targetResults) {
        if (targetResults.cancelled || targetResults.payCostsFirst) {
            return;
        }

        let otherProperties = _.omit(this.properties, 'dieCondition', 'player');

        let buttons = [];
        let waitingPromptTitle = '';
        if (context.stage === 'pretarget') {
            if (!targetResults.noCostsFirstButton) {
                buttons.push({ text: 'Pay costs first', arg: 'costsFirst' });
            }

            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if (context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }

        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            context: context,
            selector: this.selector,
            buttons: buttons,
            onSelect: (player, die) => {
                context.targets[this.name] = die;
                if (this.name === 'target') {
                    context.target = die;
                }

                return true;
            },
            onCancel: () => {
                targetResults.cancelled = true;
                return true;
            },
            onMenuCommand: (player, arg) => {
                if (arg === 'costsFirst') {
                    targetResults.costsFirst = true;
                    return true;
                }

                return true;
            }
        };
        context.game.promptForDieSelect(
            context.player,
            Object.assign(promptProperties, otherProperties)
        );
    }

    checkTarget(context) {
        if (this.properties.optional) {
            return !this.dependentTarget || this.dependentTarget.checkTarget(context);
        } else if (!context.targets[this.name]) {
            return false;
        }

        let dice = context.targets[this.name];
        if (!Array.isArray(dice)) {
            dice = [dice];
        }

        return (
            dice.every((die) => this.selector.canTarget(die, context)) &&
            this.selector.hasEnoughSelected(dice, context) &&
            !this.selector.hasExceededLimit(dice) &&
            (!this.dependentTarget || this.dependentTarget.checkTarget(context))
        );
    }
}

module.exports = AbilityTargetDie;
